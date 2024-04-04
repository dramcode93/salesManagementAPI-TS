import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createCategoryValidator = [
    check('name')
        .notEmpty().withMessage("category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const getCategoryValidator = [
    check('id').isMongoId().withMessage("invalid category id"),
    validatorMiddleware
]

export const updateCategoryValidator = [
    check('id').isMongoId().withMessage("invalid category id"),
    check('name')
        .notEmpty().withMessage("category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
]

export const deleteCategoryValidator = [
    check('id').isMongoId().withMessage("invalid category id"),
    validatorMiddleware
]