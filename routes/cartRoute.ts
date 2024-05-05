import { Router } from "express";
import { addToProductCart, getLoggedUserCart, removeSpecificCartItem, clearLoggedUserCart, updateCartItemQuantity, applyCoupons } from "../controllers/cart";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import {getLoggedUserCartValidator,
    updateCartItemQuantityValidator,
    removeSpecificCartItemValidator,
    clearLoggedUserCartValidator
} from "../utils/validation/cartValidator"
const cartRoute = Router();
cartRoute.use(protectRoutes, checkActive), allowedTo('customer');

cartRoute.route('/')
    .post(addToProductCart)
    .get(getLoggedUserCart)
    .delete(clearLoggedUserCartValidator,clearLoggedUserCart);
cartRoute.put("/cartRoute",applyCoupons);
cartRoute.route('/:id').put(updateCartItemQuantityValidator,updateCartItemQuantity).delete(removeSpecificCartItemValidator,removeSpecificCartItem);
export default cartRoute;