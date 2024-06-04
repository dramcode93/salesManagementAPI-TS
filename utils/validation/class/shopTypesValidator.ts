import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createShopTypeValidator: express.RequestHandler[] = [
    check('type_ar')
        .notEmpty().withMessage("type arabic Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("type arabic Name length must be between 2 and 50"),
    check('type_en')
        .notEmpty().withMessage("type english Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("type english Name length must be between 2 and 50"),
    validatorMiddleware,
];

export const getShopTypeValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("Invalid shop type Id"),
    validatorMiddleware,
];

export const updateShopTypeValidator: express.RequestHandler[] = [
    check("id").isMongoId().withMessage("Invalid shop type Id"),
    check('type_ar').optional().isLength({ min: 2, max: 50 }).withMessage("type arabic Name length must be between 2 and 50"),
    check('type_en').optional().isLength({ min: 2, max: 50 }).withMessage("type english Name length must be between 2 and 50"),
    validatorMiddleware,
];

export const deleteShopTypeValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("Invalid shop type Id"),
    validatorMiddleware,
];