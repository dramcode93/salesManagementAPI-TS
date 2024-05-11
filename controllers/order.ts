import express from 'express';
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";
import ordersModel from '../models/orderModel';
import carts from "../models/cartModel";
import usersModel from '../models/usersModel';
import productsModel from "../models/productsModel";
import { orderModel, CartModel, UserModel, BillProducts } from '../interfaces';

// /api/orders/cartId
export const createCashOrder = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
// get cart depend on cartId
    const shippingPrice = 0 ;
    const cart: CartModel | null = await carts.findById(req.params.id);
    if (!cart) { return next(new ApiErrors(`there is no cart for this id:${req.params.id} :`, 404)); };
// get order price depend on cart price check coupon
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + shippingPrice;
// create order with default payment cash
    const user: UserModel | null = await usersModel.findById(req.user!._id);
    const order: orderModel | null = await ordersModel.create({
        user: user,
        cartItems: cart.cartItems,
        totalOrderPrice,
        userAddress: user!.address,
        userPhone: user!.phone,
    })
// decrement  quantity of product ,increase sold 
if (order){
    const bulkOption:any = cart.cartItems.map((items: BillProducts)=>({ 
        updateOne :{
            filter:{ _id: items.product},
            update: { $inc: { quantity: -items.productQuantity, sold : +items.productQuantity } }
        }
    }))
await productsModel.bulkWrite(bulkOption ,{})
    // clear cart depend on cartId 
    await carts.findByIdAndDelete(req.params.id)
}
    res.status(200).json({ data: order, message: 'make order successfully' });
})

