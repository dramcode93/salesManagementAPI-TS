import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addShopAddress, addShopPhone, addShopType, checkCreateShop, checkShops, createShop, deleteShopAddress, deleteShopPhone, deleteShopType, getMyShop, getShop, getShops, updateShop } from "../controllers/shops";
import { createShopValidator, getShopValidator, shopAddressValidator, shopPhoneValidator, shopTypeValidator, updateShopValidator } from "../utils/validation/shopsValidator";
import productsRoute from "./productsRoute";

const shopsRoute: Router = Router();

shopsRoute.use('/:shopId/products', productsRoute);

shopsRoute.route('/').get(getShops);

shopsRoute.use(protectRoutes, checkActive);

shopsRoute.route('/').post(allowedTo('admin'), checkCreateShop, createShopValidator, createShop);


shopsRoute.use(checkShops);

shopsRoute.route('/myShop').get(allowedTo('admin'), getMyShop);
shopsRoute.route("/:id")
    .get(allowedTo('admin', 'user'), getShopValidator, getShop)
    .put(allowedTo('admin'), updateShopValidator, updateShop);

shopsRoute.use(allowedTo('admin'));

shopsRoute.route("/:id/type")
    .put(shopTypeValidator, addShopType)
    .delete(shopTypeValidator, deleteShopType);

shopsRoute.route("/:id/address")
    .put(shopAddressValidator, addShopAddress)
    .delete(shopAddressValidator, deleteShopAddress);

shopsRoute.route("/:id/phone")
    .put(shopPhoneValidator, addShopPhone)
    .delete(shopPhoneValidator, deleteShopPhone);

export default shopsRoute;