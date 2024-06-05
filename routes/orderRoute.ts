import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { createCashOrder, getAllOrders, getSpecificOrder, filterOrders, updateOrderToPaid, updateOrderToDelivered } from "../controllers/order"
import { getOrderValidator } from "../utils/validation/ordersValidator";
import { GetOrderDto } from "../utils/validation/class/ordersValidator";
import classValidatorMiddleware from "../middlewares/classValidatorMiddleware";
const orderRoute = Router();
orderRoute.use(protectRoutes, checkActive, checkShops);

orderRoute.route("/")
    .get(allowedTo('customer', 'user', 'admin'), filterOrders, getAllOrders)
    .post(allowedTo('customer'), createCashOrder);
orderRoute.route("/:id").get(allowedTo('customer', 'user', 'admin'), classValidatorMiddleware(GetOrderDto), getSpecificOrder)
orderRoute.route("/:id/pay").put(allowedTo('user', 'admin'), classValidatorMiddleware(GetOrderDto), updateOrderToPaid)
orderRoute.route("/:id/deliver").put(allowedTo('user', 'admin'), classValidatorMiddleware(GetOrderDto), updateOrderToDelivered)

export default orderRoute;