import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addShopAddress, addShopPhone, addShopType, checkCreateShop, checkShops, createShop, deleteShopAddress, deleteShopPhone, deleteShopType, getMyShop, getShop, getShops, updateShop } from "../controllers/shops";
import { createShopValidator, getShopValidator, shopAddressValidator, shopPhoneValidator, shopTypeValidator, updateShopValidator } from "../utils/validation/shopsValidator";
import productsRoute from "./productsRoute";

const shopsRoute: Router = Router();

shopsRoute.use('/:shopId/products', productsRoute);

shopsRoute.route('/').get(getShops);
// ! shopsRoute.route("/:id").get(getShopValidator, getShop);

shopsRoute.use(protectRoutes, checkActive);

shopsRoute.route('/').post(allowedTo('admin'), checkCreateShop, createShopValidator, createShop);


shopsRoute.use(checkShops, allowedTo('admin'));

shopsRoute.route('/myShop')
    .get(getMyShop)
    .put(updateShopValidator, updateShop);

shopsRoute.route("/myShop/type")
    .put(shopTypeValidator, addShopType)
    .delete(shopTypeValidator, deleteShopType);

shopsRoute.route("/myShop/address")
    .put(shopAddressValidator, addShopAddress)
    .delete(shopAddressValidator, deleteShopAddress);

shopsRoute.route("/myShop/phone")
    .put(shopPhoneValidator, addShopPhone)
    .delete(shopPhoneValidator, deleteShopPhone);

export default shopsRoute;