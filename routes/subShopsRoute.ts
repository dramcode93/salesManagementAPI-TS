import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { addSubShopPayment, addSubShopPhone, changeSubShopActivation, createSubShop, deleteSubShopPayment, deleteSubShopPhone, filterSubShops, getSubShop, getSubShops, getSubShopsList, updateSubShop } from "../controllers/subShops";
import { createSubShopValidator, getSubShopValidator, subShopActiveValidator, subShopPhoneValidator, updateSubShopValidator } from "../utils/validation/subShopsValidator";
import { checkShops } from "../controllers/shops";

const subShopsRoute: Router = Router();

subShopsRoute.use(protectRoutes, checkActive, checkShops);

subShopsRoute.route('/list').get(allowedTo('admin', 'user', 'customer'), filterSubShops, getSubShopsList);

subShopsRoute.use(allowedTo('admin'));
subShopsRoute.route('/')
    .get(filterSubShops, getSubShops)
    .post(createSubShopValidator, createSubShop);

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