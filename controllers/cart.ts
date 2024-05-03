import express from 'express';
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import cartModel from "../models/cartModel";
import productsModel from "../models/productsModel";
import { ProductModel,CartModel,BillProducts } from "../interfaces";

export const addToProductCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
    const productId:string= req.body.productId;
    const product:ProductModel|null = await productsModel.findById(productId);
    let cart: any= await cartModel.findOne({user:req.user?._id});
    if(!cart){
        cart = await cartModel.create({
            user: req.user?._id,
            cartItems:[{product:productId,totalPrice:product?.sellingPrice}]
        });
    }
    else{
            //product exist in cart , update product quantity
            const productIndex:number = cart.cartItems.findIndex((item:BillProducts)=> item.product.toString()==productId);
                if(productIndex>-1){
                    const cartItem:BillProducts = cart.cartItems[productIndex];
                    cartItem.productQuantity+=1;
                    cart.cartItems[productIndex]=cartItem;
                }
                else{
                    //product not exist in cart ,push product to cart
                    cart.cartItems.push({product:productId})
                }
        }
        await cart.save();
});
export const getLoggedUserCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
const cart:any = await cartModel.findOne(req.user?._id);

if(!cart){
    return next(new ApiErrors(`there is no cart for this user id :${req.user?._id}`,404))
}
res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});
});

export const removeSpecificCartItem =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
const cart:any = await cartModel.findOneAndUpdate({user:req.user?._id},
    {
        $pull:{cartItems:{_id:req.params.itemId}}
    },
    {new:true});
    res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});
});

export const clearLoggedUserCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
await cartModel.findOneAndDelete({user:req.user?._id});
res.status(204).send();
});

export const updateCartItemQuantity =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
const quantity:number = req.body.productQuantity;
const cart:any = await cartModel.findOne({user:req.user?._id});
if(!cart){
    return next(new ApiErrors(`there is no cart for this user id :${req.user?._id}`,404))
}
const itemIndex:number = cart.cartItems.findIndex((item:any)=> item._id.toString()==req.params.itemId);
                if(itemIndex>-1){
                    const cartItem:BillProducts = cart.cartItems[itemIndex];
                    cartItem.productQuantity+=quantity;
                    cart.cartItems[itemIndex]=cartItem;
                }else{
                return next(new ApiErrors(`there is no item for this id :${req.params.itemId}`,404))
                }
                await cart.save();
});