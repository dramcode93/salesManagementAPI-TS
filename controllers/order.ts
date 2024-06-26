import express from 'express';
import expressAsyncHandler from "express-async-handler";
import mongoose from 'mongoose';
import ordersModel from '../models/orderModel';
import carts from "../models/cartModel";
import productsModel from "../models/productsModel";
import shopsModel from '../models/shopsModel';
import subShopsModel from '../models/subShopsModel';
import dailySalesModel from '../models/dailySalesModel';
import dailySubSalesModel from '../models/dailySubSalesModel';
import monthlySalesModel from '../models/monthlySalesModel';
import monthlySubSalesModel from '../models/monthlySubSalesModel';
import yearlySalesModel from '../models/yearlySalesModel';
import yearlySubSalesModel from '../models/yearlySubSalesModel';
import ApiErrors from "../utils/errors";
import { OrderModel, CartModel, BillProducts, ShopModel, SalesModel, SubSalesModel, SubShopModel, FilterData } from '../interfaces';
import { getAll, getOne } from "./refactorHandler";

export const createCashOrder = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // * get cart depend on user id
        const cart: CartModel | null = await carts.findOne({ user: req.user?._id }).session(session);
        if (!cart) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiErrors(`there is no cart for this user`, 404));
        };

        const shop: ShopModel | null = await shopsModel.findById(cart.cartItems[0].product.shop).session(session);
        if (!shop) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiErrors(`there is no shop for this id`, 404));
        };

        // * get order price depend on cart price check coupon
        const cartPrice: number = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
        let totalOrderPrice: number = cartPrice// + shop.shippingPrice;
        if (req.body.receivingMethod == "delivery") {
            const subShop: SubShopModel | null = await subShopsModel.findById(req.body.subShop).session(session);
            if (subShop?.address.governorate.toString() === req.user?.address[0].governorate.toString()) { totalOrderPrice += subShop!.shippingPriceInside }
            else { totalOrderPrice += subShop!.shippingPriceOutside };
        };

        // * create order with default payment cash
        await Promise.all(cart.cartItems.map(async (item: BillProducts) => {
            if (item.product.quantity < item.productQuantity) {
                await session.abortTransaction();
                session.endSession();
                return next(new ApiErrors(`the quantity for product ${item.product.name} not available now, it has ${item.product.quantity} only`, 400));
            };
        }));

        const createdOrder = await ordersModel.create([{
            user: req.user?._id,
            shop: shop._id,
            cartItems: cart.cartItems,
            totalOrderPrice,
            receivingMethod: req.body.receivingMethod,
            subShop: req.body.subShop,
        }], { session });
        const order: OrderModel = createdOrder[0];

        // * decrement quantity of product ,increase received 
        const bulkOption = cart.cartItems.map((items: BillProducts) => {
            // * Find the subShopIndex
            const subShopIndex: number = items.product.subShops.findIndex((shop: any) => shop.subShop.toString() === req.body.subShop);

            // * Build the update object
            const updateObject: any = {
                $inc: {
                    quantity: -items.productQuantity,
                    receivedQuantity: +items.productQuantity
                }
            };

            if (subShopIndex > -1) { updateObject.$inc[`subShops.${subShopIndex}.quantity`] = -items.productQuantity; };

            return {
                updateOne: {
                    filter: { _id: items.product._id },
                    update: updateObject,
                    session: session
                }
            };
        });
        await productsModel.bulkWrite(bulkOption, { session });

        // * clear cart depend on cartId
        await carts.findOneAndDelete({ user: req.user?._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ data: order, message: 'make order successfully' });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

export const filterOrders = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    if (req.user?.role == 'customer') { filterData.user = req.user?._id; }
    else if (req.user?.role == 'user') { filterData.shop = req.user?.shop; filterData.subShop = req.user.subShop }
    else { filterData.shop = req.user?.shop; };
    req.filterData = filterData;
    next();
};
export const getAllOrders = getAll<OrderModel>(ordersModel, 'orders')
export const getSpecificOrder = getOne<OrderModel>(ordersModel, 'orders', '')

export const updateOrderToPaid = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // * Update Order is Paid
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order: OrderModel | null = await ordersModel.findById(req.params.id).session(session);
        if (!order || order.isPaid === true) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiErrors(`there is no order with this id : ${req.params.id} or order already paid`, 404));
        };
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder: OrderModel = await order.save({ session });

        // * update sales & sub sales
        const date: Date = new Date();
        const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));

        const products: BillProducts[] = order.cartItems;
        let totalProductPrice: number = 0;
        for (const item of products) {
            const productPrice: number = item.product.productPrice * item.productQuantity;
            totalProductPrice += productPrice;
        };

        // * Daily
        // ? Sales
        const dailySales: SalesModel | null = await dailySalesModel.findOne({ shop: order.shop, createdAt: { $gte: startOfDay, $lt: endOfDay } }).session(session);
        if (!dailySales) { await dailySalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop }], { session }); }
        else {
            dailySales.sales += order.totalOrderPrice;
            dailySales.earnings += (order.totalOrderPrice - totalProductPrice);
            dailySales.save({ session });
        };

        // ? Sub Sales
        const dailySubSales: SubSalesModel | null = await dailySubSalesModel.findOne({ shop: order.shop, subShop: order.subShop, createdAt: { $gte: startOfDay, $lt: endOfDay } }).session(session);
        if (!dailySubSales) { await dailySubSalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop, subShop: order.subShop }], { session }); }
        else {
            dailySubSales.sales += order.totalOrderPrice;
            dailySubSales.earnings += (order.totalOrderPrice - totalProductPrice);
            dailySubSales.save({ session });
        };

        // * Monthly
        // ? Sales
        const monthlySales: SalesModel | null = await monthlySalesModel.findOne({ shop: order.shop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } }).session(session);
        if (!monthlySales) { await monthlySalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop }], { session }); }
        else {
            monthlySales.sales += order.totalOrderPrice;
            monthlySales.earnings += (order.totalOrderPrice - totalProductPrice);
            monthlySales.save({ session });
        };

        // ? Sub Sales
        const monthlySubSales: SubSalesModel | null = await monthlySubSalesModel.findOne({ shop: order.shop, subShop: order.subShop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } }).session(session);
        if (!monthlySubSales) { await monthlySubSalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop, subShop: order.subShop }], { session }); }
        else {
            monthlySubSales.sales += order.totalOrderPrice;
            monthlySubSales.earnings += (order.totalOrderPrice - totalProductPrice);
            monthlySubSales.save({ session });
        };

        // * Yearly
        // ? Sales
        const yearlySales: SalesModel | null = await yearlySalesModel.findOne({ shop: order.shop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } }).session(session);
        if (!yearlySales) { await yearlySalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop }], { session }); }
        else {
            yearlySales.sales += order.totalOrderPrice;
            yearlySales.earnings += (order.totalOrderPrice - totalProductPrice);
            yearlySales.save({ session });
        };

        // ? Sub Sales
        const yearlySubSales: SubSalesModel | null = await yearlySubSalesModel.findOne({ shop: order.shop, subShop: order.subShop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } }).session(session);
        if (!yearlySubSales) { await yearlySubSalesModel.create([{ sales: order.totalOrderPrice, earnings: order.totalOrderPrice - totalProductPrice, shop: order.shop, subShop: order.subShop }], { session }); }
        else {
            yearlySubSales.sales += order.totalOrderPrice;
            yearlySubSales.earnings += (order.totalOrderPrice - totalProductPrice);
            yearlySubSales.save({ session });
        };

        // * update shop & sub shop products money
        await shopsModel.findByIdAndUpdate(order.shop, { $inc: { allMoney: order.totalOrderPrice, productsMoney: -totalProductPrice } }, { new: true, session });
        await subShopsModel.findByIdAndUpdate(order.subShop, { $inc: { allMoney: order.totalOrderPrice, productsMoney: -totalProductPrice } }, { new: true, session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ status: 'success', data: updatedOrder });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

export const updateOrderToDelivered = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order: OrderModel | null = await ordersModel.findById(req.params.id).session(session);
        if (!order || order.isDelivered === true) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiErrors(`there is no order with this id : ${req.params.id} or order already delivered`, 404));
        };
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder: OrderModel = await order.save({ session });
        const bulkOption = order.cartItems.map((items: BillProducts) => ({
            updateOne: {
                filter: { _id: items.product },
                update: { $inc: { receivedQuantity: -items.productQuantity, sold: +items.productQuantity } },
                session: session
            }
        }));
        await productsModel.bulkWrite(bulkOption, { session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ status: 'success', data: updatedOrder });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});