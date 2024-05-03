import { Router } from "express";
import { addToProductCart,getLoggedUserCart,removeSpecificCartItem,clearLoggedUserCart,updateCartItemQuantity} from "../controllers/cart";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const cartRoute = Router();
cartRoute.use(protectRoutes, checkActive);

cartRoute.route('/')
    .post(allowedTo('user'), addToProductCart)
    .get(getLoggedUserCart)
    .delete(clearLoggedUserCart);
cartRoute.route('/:itemId').put(updateCartItemQuantity).delete(removeSpecificCartItem);
export default cartRoute;