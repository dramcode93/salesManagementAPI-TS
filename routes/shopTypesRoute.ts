import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { createShopType, deleteShopType, getShopType, getShopTypes, getShopTypesList, updateShopType } from "../controllers/shopTypes";
import { createShopTypeValidator, deleteShopTypeValidator, getShopTypeValidator, updateShopTypeValidator } from "../utils/validation/shopTypesValidator";
import { CreateShopTypeDto, DeleteShopTypeDto, GetShopTypeDto, UpdateShopTypeDto } from "../utils/validation/class/shopTypesValidator";
import classValidatorMiddleware from "../middlewares/classValidatorMiddleware";

const shopTypesRoute: Router = Router();

shopTypesRoute.use(protectRoutes, checkActive);

shopTypesRoute.route('/')
    .get(getShopTypes)
    .post(allowedTo('manager'), classValidatorMiddleware(CreateShopTypeDto), createShopType);

shopTypesRoute.get('/list', getShopTypesList);

shopTypesRoute.route("/:id")
    .get(classValidatorMiddleware(GetShopTypeDto), getShopType)
    .put(allowedTo('manager'), classValidatorMiddleware(UpdateShopTypeDto), updateShopType)
    .delete(allowedTo('manager'), classValidatorMiddleware(DeleteShopTypeDto), deleteShopType);

export default shopTypesRoute;