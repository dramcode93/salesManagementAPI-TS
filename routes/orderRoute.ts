import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { createCashOrder,getAllOrders,getSecificOrder,filterObjectForLoggedUser,updateOrederToPaid,updateOrederToDelivered } from "../controllers/order"
const orderRoute = Router();
orderRoute.use(protectRoutes, checkActive);

orderRoute.route("/:id").post(allowedTo('customer'),createCashOrder)
    orderRoute.route("/").get(allowedTo('customer','user','admin'),filterObjectForLoggedUser,getAllOrders)
    orderRoute.route("/:id").get(getSecificOrder)
    orderRoute.route("/:id/pay").put(allowedTo('user','admin'),updateOrederToPaid)
    orderRoute.route("/:id/deliver").put(allowedTo('user','admin'),updateOrederToDelivered)


export default orderRoute;