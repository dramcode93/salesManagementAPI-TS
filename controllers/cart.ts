import express from 'express';
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import carts from "../models/cartModel";
import products from "../models/productsModel";
import couponModel from '../models/couponModel';
import { ProductModel,CartModel,BillProducts, CouponModel } from "../interfaces";


export const addToProductCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
    const productId: string = req.body.productId;
    const product: ProductModel | null = await products.findById(productId)
    let cart: any = await carts.findOne({ user: req.user?._id });
    if (!cart) {
        cart = await carts.create({
            user: req.user?._id,
            cartItems: [{ product: productId, sellingPrice: product?.sellingPrice }],
        });
    }
    else {
        //product exist in cart , update product quantity
        const productIndex: number = cart.cartItems.findIndex((item: BillProducts) => item.product.toString() === productId);
        if (productIndex > -1) {
            const cartItems: BillProducts = cart.cartItems[productIndex]
            cartItems.productQuantity += 1;
            cart.cartItems[productIndex] = cartItems;
        } else {
            //product not exist in cart ,push product to cart
            cart.cartItems.push({ product: productId });
        };
        await cart.save();
    };
    res.status(200).json({ data: cart, message: 'Product added to cart successfully' });
});
export const getLoggedUserCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id })
    if (!cart) { return next(new ApiErrors(`there is no cart for this user id :${req.user?._id}`, 404)); };
    res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });
});

export const removeSpecificCartItem =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
    const cart: any = await carts.findOneAndUpdate({user:req.user?._id},
    {
        $pull:{cartItems:{_id:req.params.itemId}}
    },
    {new:true});
    res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});
});

export const clearLoggedUserCart =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
    await carts.findOneAndDelete({user:req.user?._id});
res.status(204).send();
});

export const updateCartItemQuantity =expressAsyncHandler(async(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>=>{
const quantity:number = req.body.productQuantity;
    const cart: any = await carts.findOne({user:req.user?._id});
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
                res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });
                
});

// export const applyCoupons = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
// // get coupon based on coupon name
//     const coupon:any = await couponModel.findOne({ name: req.body.coupon, expire :{ $gt : Date.now()}})
//     if(!coupon){
//         return next(new ApiErrors('Coupon invalid or  expired',404))
//     }
//     // get logged user cart to get total price
//     const cart: CartModel | null = await carts.findOne({user :req.user?._id})
//     const totalCartPrice: Number = cart!.totalCartPrice ;
//     // calculate total after discount
//     const totalPriceAfterDiscount: number = (totalCartPrice - (totalCartPrice * coupon.discount) /100);

//     cart!.totalPriceAfterDiscount = totalPriceAfterDiscount ;
//     await cart?.save()


// })

export const applyCoupons = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // get coupon based on coupon name
    const coupon: any = await couponModel.findOne({ name: req.body.coupon, expire: { $gt: Date.now() } });
    if (!coupon) {
        return next(new ApiErrors('Coupon invalid or expired', 404));
    };
    // get logged user cart to get total price
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id });
    if (!cart) {
        return next(new ApiErrors('Cart not found', 404));
    };
    const totalCartPrice: number = cart.totalCartPrice; // Ensure totalCartPrice is a number

    // Ensure coupon.discount is a number
    // const discount: number = typeof coupon.discount === 'number' ? coupon.discount : parseFloat(coupon.discount);
    // // Ensure discount is not NaN
    // if (isNaN(discount)) {
    //     return next(new ApiErrors('Invalid discount value', 500));
    // }

    // calculate total after discount
    const totalPriceAfterDiscount: number = (totalCartPrice - (totalCartPrice * coupon.discount) / 100);

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });
});






