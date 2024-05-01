import { Router } from "express";
import { getCoupon, getCoupons, createCoupon, updateCoupon, DeleteCoupon, filterCoupons } from "../controllers/coupon";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const couponRoute: Router = Router();
couponRoute.use(protectRoutes, checkActive);

couponRoute.route('/')
    .get(filterCoupons, getCoupons)
    .post(allowedTo('admin'), createCoupon);
couponRoute.route("/:id")
    .get(getCoupon)
    .put(allowedTo('admin'), updateCoupon)
    .delete(allowedTo('admin'), DeleteCoupon);

export default couponRoute;