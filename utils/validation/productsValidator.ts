import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import categoriesModel from "../../models/categoriesModel";
import { CategoryModel } from "../../interfaces";

export const createProductValidator = [
    check('name')
        .notEmpty().withMessage("product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isNumeric().withMessage('Quantity Must be a number').toInt(),
    check('productPrice')
        .notEmpty().withMessage('product price is required')
        .isNumeric().withMessage('product price Must be a number').toFloat(),
    check('sellingPrice')
        .notEmpty().withMessage('selling price is required')
        .isNumeric().withMessage('selling price Must be a number').toFloat(),
    check('sold')
        .optional().isNumeric().withMessage('sold Must be a number').toInt(),
    check('category')
        .notEmpty().withMessage('category is required')
        .isMongoId().withMessage('Invalid category id')
        .custom(async (categoryId: string): Promise<boolean> => {
            const category: CategoryModel | null = await categoriesModel.findById(categoryId);
            if (!category) { return Promise.reject(new Error('Category does not exist')); };
            return true;
        }),
    validatorMiddleware
];

export const getProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
];

export const updateProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('quantity').optional().isNumeric().withMessage('Quantity Must be a number').toInt(),
    check('productPrice').optional().isNumeric().withMessage('product price Must be a number').toFloat(),
    check('sellingPrice').optional().isNumeric().withMessage('selling price Must be a number').toFloat(),
    check('sold').optional().isNumeric().withMessage('sold Must be a number').toInt(),
    check('category').optional().isMongoId().withMessage('Invalid category id')
        .custom(async (categoryId: string): Promise<boolean> => {
            const category: CategoryModel | null = await categoriesModel.findById(categoryId);
            if (!category) { return Promise.reject(new Error('Category does not exist')); };
            return true;
        }),
    validatorMiddleware
];

export const deleteProductValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
];