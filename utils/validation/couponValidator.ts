import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import couponModel from "../../models/couponModel";
import { CouponModel } from "../../interfaces";

export const createCouponValidator = [
    check("name").notEmpty().withMessage("coupon name is required")
        .custom(async (val: string) => {
            const coupon: CouponModel | null = await couponModel.findOne({ name: val });
            if (coupon) { return Promise.reject(new Error("coupon already exists")); };
            return true;
        }),
    check("expire").notEmpty().withMessage("coupon expired time is required").isDate().withMessage("expired time must be a date type"),
    check("discount").notEmpty().withMessage("coupon discount is required").isNumeric().withMessage("coupon discount must be a number").toInt(),
    validatorMiddleware
];

export const updateCouponValidator = [
    check('id').notEmpty().withMessage("coupon id is required").isMongoId().withMessage("Invalid coupon Id"),
    check("name").optional(),
    check("expire").optional().isDate().withMessage("expired time must be a date type"),
    check("discount").optional().isNumeric().withMessage("coupon discount must be a number").toInt(),
    validatorMiddleware
];

export const getCouponValidator = [
    check('id').notEmpty().withMessage("coupon id is required").isMongoId().withMessage("Invalid coupon Id"),
    validatorMiddleware,
];

export const deleteCouponValidator = [
    check('id').notEmpty().withMessage("coupon id is required").isMongoId().withMessage("Invalid coupon Id"),
    validatorMiddleware,
];