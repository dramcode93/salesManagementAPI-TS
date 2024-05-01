import { Router } from "express";
import { getCoupon,getCoupons,createCoupon,updateCoupon,DeleteCoupon } from "../controllers/coupon";
import { allowedTo,protectRoutes } from "../controllers/auth";

const couponRoute: Router = Router();
couponRoute.use(protectRoutes, allowedTo('admin', 'manager'));

couponRoute.route('/')
    .get(getCoupons)
    .post(createCoupon);
couponRoute.route("/:id")
    .get(getCoupon)
    .put(updateCoupon)
    .delete(DeleteCoupon);

export default couponRoute;