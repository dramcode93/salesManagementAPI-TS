import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import productsModel from "../../models/productsModel";
import { ProductModel } from "../../interfaces";
import Joi from "joi";

// export const createCategoryValidator = Joi.object({
//     body: Joi.object({
//         name: Joi.string().required().min(2).max(50).messages({
//             "string.empty": "category name is required",
//             "string.min": "category name length must be between 2 and 50",
//             "string.max": "category name length must be between 2 and 50"
//         })
//     }).required()
// });

export const createCategoryValidator: express.RequestHandler[] = [
    check('name')
        .notEmpty().withMessage("category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const getCategoryValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid category id"),
    validatorMiddleware
];

export const updateCategoryValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid category id"),
    check('name')
        .notEmpty().withMessage("category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const deleteCategoryValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid category id")
        .custom(async (value: string): Promise<boolean> => {
            const products: ProductModel[] = await productsModel.find({ category: value })
            if (products && products.length > 0) {
                const deleteProducts = products.map(async (product: ProductModel) => { await productsModel.findByIdAndDelete(product._id) });
                await Promise.all(deleteProducts);
            };
            return true;
        }),
    validatorMiddleware
];