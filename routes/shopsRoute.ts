import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addShopType, checkCreateShop, checkShops, createShop, deleteShopType, getMyShop, getShopId, getShops, resizeShopImage, updateShop, uploadShopImage } from "../controllers/shops";
import { createShopValidator, shopTypeValidator, updateShopValidator } from "../utils/validation/shopsValidator";
import productsRoute from "./productsRoute";

const shopsRoute: Router = Router();

shopsRoute.use('/:shopId/products', productsRoute);

shopsRoute.route('/').get(getShops);

shopsRoute.use(protectRoutes, checkActive, allowedTo('admin'));

shopsRoute.route('/').post(checkCreateShop, uploadShopImage, resizeShopImage, createShopValidator, createShop);

shopsRoute.use(checkShops);

shopsRoute.route('/myShop')
    .get(getShopId, getMyShop)
    .put(getShopId, uploadShopImage, resizeShopImage, updateShopValidator, updateShop);

shopsRoute.route("/myShop/type")
    .put(getShopId, shopTypeValidator, addShopType)
    .delete(getShopId, shopTypeValidator, deleteShopType);

export default shopsRoute;