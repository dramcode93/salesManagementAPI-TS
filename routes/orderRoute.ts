import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { createCashOrder } from "../controllers/order"
const orderRoute = Router();
orderRoute.use(protectRoutes, checkActive, allowedTo('customer'));

orderRoute.route("/:id")
    .post(createCashOrder)



export default orderRoute;