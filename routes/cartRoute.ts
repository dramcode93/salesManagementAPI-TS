import { Router } from "express";
import { addToProductCart, getLoggedUserCart, removeSpecificCartItem, clearLoggedUserCart, updateCartItemQuantity, applyCoupons } from "../controllers/cart";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { createProductInCartValidator, updateCartItemQuantityValidator, removeSpecificCartItemValidator } from "../utils/validation/cartValidator";

const cartRoute = Router();
cartRoute.use(protectRoutes, checkActive, allowedTo('customer'));

cartRoute.route('/')
    .get(getLoggedUserCart)
    .post(createProductInCartValidator, addToProductCart)
    .delete(clearLoggedUserCart);

cartRoute.put("/applyCoupon", applyCoupons);

cartRoute.route('/:id')
    .put(updateCartItemQuantityValidator, updateCartItemQuantity)
    .delete(removeSpecificCartItemValidator, removeSpecificCartItem);

export default cartRoute;