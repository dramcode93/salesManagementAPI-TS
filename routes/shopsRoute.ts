import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addShopAddress, addShopType, checkCreateShop, checkShops, createShop, deleteShopAddress, deleteShopType, getShop, getShops, getShopsList, updateShop } from "../controllers/shops";
import { createShopValidator, getShopValidator, shopAddressValidator, shopTypeValidator, updateShopValidator } from "../utils/validation/shopsValidator";
import productsRoute from "./productsRoute";

const shopsRoute: Router = Router();

shopsRoute.use('/:shopId/products', productsRoute);
shopsRoute.use(protectRoutes, checkActive);

shopsRoute.route('/')
    .get(getShops)
    .post(allowedTo('admin'), checkCreateShop, createShopValidator, createShop);

// shopsRoute.get('/list', getShopsList);

shopsRoute.route("/:id")
    .get(getShopValidator, getShop)
    .put(allowedTo('admin'), checkShops, updateShopValidator, updateShop);

shopsRoute.use(allowedTo('admin'));

shopsRoute.route("/:id/type")
    .put(shopTypeValidator, addShopType)
    .delete(shopTypeValidator, deleteShopType);

shopsRoute.route("/:id/address")
    .put(shopAddressValidator, addShopAddress)
    .delete(shopAddressValidator, deleteShopAddress);

export default shopsRoute;