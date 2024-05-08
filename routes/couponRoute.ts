import { Router } from "express";
import { getCoupon, getCoupons, createCoupon, updateCoupon, DeleteCoupon, filterCoupons } from "../controllers/coupon";
import { createCouponValidator, deleteCouponValidator, getCouponValidator, updateCouponValidator } from "../utils/validation/couponValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const couponRoute: Router = Router();
couponRoute.use(protectRoutes, checkActive);

couponRoute.route('/')
    .get(allowedTo('admin', 'user'), filterCoupons, getCoupons)
    .post(allowedTo('admin'), createCouponValidator, createCoupon);
couponRoute.route("/:id")
    .get(allowedTo('admin', 'user'), getCouponValidator, getCoupon)
    .put(allowedTo('admin'), updateCouponValidator, updateCoupon)
    .delete(allowedTo('admin'), deleteCouponValidator, DeleteCoupon);

export default couponRoute;