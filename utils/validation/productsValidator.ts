import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createProductValidator = [
    check('name')
        .notEmpty().withMessage("product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const getProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
]

export const updateProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('name')
        .optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
]

export const deleteProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
]