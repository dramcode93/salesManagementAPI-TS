import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { createShopType, deleteShopType, getShopType, getShopTypes, getShopTypesList, updateShopType } from "../controllers/shopTypes";
import { createShopTypeValidator, deleteShopTypeValidator, getShopTypeValidator, updateShopTypeValidator } from "../utils/validation/shopTypesValidator";

const shopTypesRoute: Router = Router();

shopTypesRoute.use(protectRoutes, checkActive);

shopTypesRoute.route('/')
    .get(getShopTypes)
    .post(allowedTo('manager'), createShopTypeValidator, createShopType);

shopTypesRoute.get('/list', getShopTypesList);

shopTypesRoute.route("/:id")
    .get(getShopTypeValidator, getShopType)
    .put(allowedTo('manager'), updateShopTypeValidator, updateShopType);
// .delete(allowedTo('manager'), deleteShopTypeValidator, deleteShopType);

export default shopTypesRoute;