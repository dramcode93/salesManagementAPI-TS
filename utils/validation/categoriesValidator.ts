import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import productsModel from "../../models/productsModel";
import { ProductModel } from "../../interfaces";

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
    check('id').isMongoId().withMessage("invalid category id")
        .custom(async (value: string) => {
            const products: ProductModel[] = await productsModel.find({ category: value })
            if (products && products.length > 0) {
                const deleteProducts = products.map(async (product: ProductModel) => { await productsModel.findByIdAndDelete(product._id) });
                await Promise.all(deleteProducts);
            };
            return true;
        }),
    validatorMiddleware
]