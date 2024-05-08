import express from 'express';
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import carts from "../models/cartModel";
import products from "../models/productsModel";
import couponModel from '../models/couponModel';
import { ProductModel, CartModel, BillProducts, CouponModel } from "../interfaces";

export const addToProductCart = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const productId: string = req.body.productId;
    const product: ProductModel | null = await products.findById(productId);
    if (!product) { return next(new ApiErrors('product not found', 404)); };
    let cart: any = await carts.findOne({ user: req.user?._id });

    if (!cart) { cart = await carts.create({ user: req.user?._id, cartItems: [{ product: productId, sellingPrice: product.sellingPrice }] }); } // * Create a new cart if it doesn't exist
    else {
        // * Check if the product exists in the cart
        const productIndex: number = cart.cartItems.findIndex((item: BillProducts): boolean => item.product._id.toString() === productId);

        if (productIndex > -1) {
            // * Product already exists in the cart, update its quantity
            const cartItems: BillProducts = cart.cartItems[productIndex];
            cartItems.productQuantity += 1;
            if (product.quantity >= cartItems.productQuantity) { cart.cartItems[productIndex] = cartItems; }
            else { return next(new ApiErrors('invalid quantity for this product.', 400)); };
            // * Product does not exist in the cart, push it to the cart
        } else {
            if (product.quantity <= 0) { return next(new ApiErrors('invalid quantity for this product.', 400)); };
            if (cart.cartItems.length > 0) {
                const existingProduct: ProductModel | null = await products.findById(cart.cartItems[0].product._id);
                if (existingProduct?.shop.toString() === product.shop.toString()) { cart.cartItems.push({ product: productId }); }
                else { return next(new ApiErrors('cannot add product from a different shop.', 400)); };
            };
        };
        await cart.save();
    };
    res.status(200).json({ data: cart, message: 'Product added to cart successfully' });
});

export const getLoggedUserCart = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id });
    if (!cart) { return next(new ApiErrors(`there is no cart for user : ${req.user?.name}`, 404)); };
    res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });
});

export const removeSpecificCartItem = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const cart: CartModel | null = await carts.findOneAndUpdate({ user: req.user?._id }, { $pull: { cartItems: { _id: req.params.id } } }, { new: true });
    res.status(200).json({ status: 'success', numOfCartItems: cart!.cartItems.length, data: cart });
});

export const clearLoggedUserCart = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    await carts.findOneAndDelete({ user: req.user?._id });
    res.status(204).json({ status: 'success' });
});

export const updateCartItemQuantity = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id });
    if (!cart) { return next(new ApiErrors(`there is no cart for user : ${req.user?.name}`, 404)); };
    const itemIndex: number = cart.cartItems.findIndex((item: BillProducts) => item.product._id.toString() === req.params.id.toString());
    if (itemIndex > -1) {
        const cartItem: BillProducts = cart.cartItems[itemIndex];
        cartItem.productQuantity = req.body.productQuantity;
        cart.cartItems[itemIndex] = cartItem;
    }
    else { return next(new ApiErrors(`there is no item for this id : ${req.params.id}`, 404)); };
    await cart.save();
    res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });

});

export const applyCoupons = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // * get logged user cart to get total price
    const cart: CartModel | null = await carts.findOne({ user: req.user?._id });
    if (!cart) { return next(new ApiErrors('Cart not found', 404)); };

    // * get coupon based on coupon name
    const coupon: CouponModel | null = await couponModel.findOne({ name: req.body.coupon, expire: { $gt: Date.now() }, shop: cart.cartItems[0].product.shop });
    if (!coupon) { return next(new ApiErrors('Coupon invalid or expired', 404)); };

    // * calculate total after discount
    const totalPriceAfterDiscount: number = (cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100);

    // * Check if another coupon has already been applied
    // TODO old method : if (cart.totalPriceAfterDiscount < totalCartPrice) { return next(new ApiErrors('Another coupon has already been applied', 400)); };
    if (cart.coupon) { return next(new ApiErrors('Another coupon has already been applied', 400)); };

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    cart.coupon = coupon._id;
    await cart.save();
    res.status(200).json({ status: "success", numberOfCartItems: cart.cartItems.length, data: cart });
});