import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkCreateShop, checkShops, createShop, getShop, getShops, getShopsList, updateShop } from "../controllers/shops";
import { createShopValidator, getShopValidator, updateShopValidator } from "../utils/validation/shopsValidator";

const shopsRoute: Router = Router();

shopsRoute.use(protectRoutes, checkActive);

shopsRoute.route('/')
    .get(getShops)
    .post(allowedTo('admin'), checkCreateShop, createShopValidator, createShop);

// shopsRoute.get('/list', getShopsList);

shopsRoute.route("/:id")
    .get(getShopValidator, getShop)
    .put(allowedTo('admin'), checkShops, updateShopValidator, updateShop);

export default shopsRoute;