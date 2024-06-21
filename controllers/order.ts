import express from 'express';
import expressAsyncHandler from "express-async-handler";
import ordersModel from '../models/orderModel';
import carts from "../models/cartModel";
import productsModel from "../models/productsModel";
import shopsModel from '../models/shopsModel';
import subShopsModel from '../models/subShopsModel';
import ApiErrors from "../utils/errors";
import { getAll, getOne } from "./refactorHandler";
import { OrderModel, CartModel, BillProducts, ShopModel } from '../interfaces';

export const createCashOrder = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // * get cart depend on user id
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id });
    if (!cart) { return next(new ApiErrors(`there is no cart for this user`, 404)); };
    const shop: ShopModel | null = await shopsModel.findById(cart.cartItems[0].product.shop);
    if (!shop) { return next(new ApiErrors(`there is no shop for this id`, 404)); };

    // * get order price depend on cart price check coupon
    const cartPrice: number = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalOrderPrice: number = cartPrice// + shop.shippingPrice;

    // * create order with default payment cash
    cart.cartItems.map((item: BillProducts): void => { if (item.product.quantity < item.productQuantity) { return next(new ApiErrors(`the quantity for product ${item.product.name} not available now, it has ${item.product.quantity} only`, 400)); }; });
    const order: OrderModel = await ordersModel.create({
        user: req.user?._id,
        shop: shop._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        receivingMethod: req.body.receivingMethod,
    });

    // * decrement quantity of product ,increase sold 
    const bulkOption = cart.cartItems.map((items: BillProducts) => ({
        updateOne: {
            filter: { _id: items.product },
            update: { $inc: { quantity: -items.productQuantity, receivedQuantity: +items.productQuantity } }
        }
    }));
    await productsModel.bulkWrite(bulkOption, {});

    // * clear cart depend on cartId
    await carts.findOneAndDelete({ user: req.user?._id });

    res.status(200).json({ data: order, message: 'make order successfully' });
});

export const filterOrders = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.user?.role == 'customer') { req.filterData = { user: req.user?._id }; }
    else { req.filterData = { shop: req.user?.shop }; };
    next();
};
export const getAllOrders = getAll<OrderModel>(ordersModel, 'orders')
export const getSpecificOrder = getOne<OrderModel>(ordersModel, 'orders', '')

export const updateOrderToPaid = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const order: OrderModel | null = await ordersModel.findById(req.params.id);
    if (!order || order.isPaid === true) { return next(new ApiErrors(`there is no order with this id : ${req.params.id} or order already paid`, 404)); };
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder: OrderModel = await order.save();
    await shopsModel.findByIdAndUpdate(order.shop, { $inc: { allMoney: order.totalOrderPrice } }, { new: true });
    await subShopsModel.findByIdAndUpdate(order.subShop, { allMoney: order.totalOrderPrice }, { new: true });
    res.status(200).json({ status: 'success', data: updatedOrder });
});

export const updateOrderToDelivered = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const order: OrderModel | null = await ordersModel.findById(req.params.id);
    if (!order || order.isDelivered === true) { return next(new ApiErrors(`there is no order with this id : ${req.params.id} or order already delivered`, 404)); };
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder: OrderModel = await order.save();
    const bulkOption = order.cartItems.map((items: BillProducts) => ({
        updateOne: {
            filter: { _id: items.product },
            update: { $inc: { receivedQuantity: -items.productQuantity, sold: +items.productQuantity } }
        }
    }));
    await productsModel.bulkWrite(bulkOption, {});
    res.status(200).json({ status: 'success', data: updatedOrder });
});