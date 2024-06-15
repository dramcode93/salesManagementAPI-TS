import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addSubShopPayment, addSubShopPhone, changeSubShopActivation, createSubShop, deleteSubShopPayment, deleteSubShopPhone, getSubShop, getSubShops, updateSubShop } from "../controllers/subShops";
import { createSubShopValidator, getSubShopValidator, subShopActiveValidator, subShopPhoneValidator, updateSubShopValidator } from "../utils/validation/subShopsValidator";
import { checkShops } from "../controllers/shops";

const subShopsRoute: Router = Router();

subShopsRoute.route('/').get(getSubShops);

subShopsRoute.use(protectRoutes, checkActive, checkShops, allowedTo('admin'));

subShopsRoute.route('/').post(createSubShopValidator, createSubShop);

subShopsRoute.route('/:id')
    .get(getSubShopValidator, getSubShop)
    .put(updateSubShopValidator, updateSubShop);

subShopsRoute.route("/:id/phone")
    .put(subShopPhoneValidator, addSubShopPhone)
    .delete(subShopPhoneValidator, deleteSubShopPhone);

subShopsRoute.route("/:id/payment")
    .put(getSubShopValidator, addSubShopPayment)
    .delete(getSubShopValidator, deleteSubShopPayment);

subShopsRoute.route("/:id/active").put(subShopActiveValidator, changeSubShopActivation);

export default subShopsRoute;