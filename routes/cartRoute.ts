import { Router } from "express";
import { addToProductCart, getLoggedUserCart, removeSpecificCartItem, clearLoggedUserCart, updateCartItemQuantity, applyCoupons } from "../controllers/cart";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const cartRoute = Router();
cartRoute.use(protectRoutes, checkActive);

cartRoute.route('/')
    .post(allowedTo('customer'), addToProductCart)
    .get(getLoggedUserCart)
    .delete(clearLoggedUserCart);
cartRoute.put("/cartRoute",applyCoupons);
cartRoute.route('/:itemId').put(updateCartItemQuantity).delete(removeSpecificCartItem);
export default cartRoute;