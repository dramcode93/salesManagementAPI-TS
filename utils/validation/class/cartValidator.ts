import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import productModel from "../../models/productsModel";
import { ProductModel } from "../../interfaces";

export const createProductInCartValidator: express.RequestHandler[] = [
    check("productId").notEmpty().withMessage("Product is required").isMongoId().withMessage("invalid product id"),
    validatorMiddleware
];

export const updateCartItemQuantityValidator: express.RequestHandler[] = [
    check('id').notEmpty().withMessage("Product is required").isMongoId().withMessage("invalid product id"),
    check('productQuantity').notEmpty().withMessage("product quantity is required").isNumeric().withMessage("product quantity must be number").toInt()
        .custom(async (productQuantity: number, { req }): Promise<boolean> => {
            const product: ProductModel | null = await productModel.findById(req.params?.id);
            if (!product) { return Promise.reject(new Error("product not found")); };
            if (product.quantity <= 0 || product.quantity < productQuantity) { throw new Error(`invalid quantity for product : ${product.name}`); };
            return true;
        }),
    validatorMiddleware
];

export const removeSpecificCartItemValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];