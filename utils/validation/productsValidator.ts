import fs from "fs";
import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import categoriesModel from "../../models/categoriesModel";
import productsModel from "../../models/productsModel";
import shopsModel from "../../models/shopsModel";
import { CategoryModel, ProductModel } from "../../interfaces";

export const createProductValidator: express.RequestHandler[] = [
    check('name')
        .notEmpty().withMessage("product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('description')
        .notEmpty().withMessage("product description is required")
        .isLength({ min: 2, max: 300 }).withMessage("name length must be between 2 and 300"),
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
        .custom(async (categoryId: string, { req }): Promise<boolean> => {
            const category: CategoryModel | null = await categoriesModel.findOne({ _id: categoryId, shop: req.user.shop });
            if (!category) { return Promise.reject(new Error('Category does not exist')); };
            return true;
        }),
    validatorMiddleware
];

export const getProductValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
];

export const updateProductValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('description').optional().isLength({ min: 2, max: 300 }).withMessage("description length must be between 2 and 300"),
    check('productPrice').optional().isNumeric().withMessage('product price Must be a number').toFloat(),
    check('sellingPrice').optional().isNumeric().withMessage('selling price Must be a number').toFloat(),
    check('sold').optional().isNumeric().withMessage('sold Must be a number').toInt(),
    check('category').optional().isMongoId().withMessage('Invalid category id')
        .custom(async (categoryId: string, { req }): Promise<boolean> => {
            const category: CategoryModel | null = await categoriesModel.findOne({ _id: categoryId, shop: req.user.shop });
            if (!category) { return Promise.reject(new Error('Category does not exist')); };
            return true;
        }),
    check('quantity').optional().isNumeric().withMessage('Quantity Must be a number').toInt()
        .custom(async (quantity: number) => { if (quantity) { return Promise.reject(new Error('you can not update Quantity here')); }; return true; }),
    validatorMiddleware
];

export const transportProductQuantityValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('from').notEmpty().withMessage("sub shop 1 is required").isMongoId().withMessage("invalid sub shop id"),
    check('to').notEmpty().withMessage("sub shop 2 is required").isMongoId().withMessage("invalid sub shop id"),
    check('quantity').notEmpty().withMessage("quantity is required").isNumeric().withMessage('quantity Must be a number').toInt(),
    validatorMiddleware
];

export const ProductImagesValidator: express.RequestHandler[] = [
    check('images').notEmpty().withMessage('product images is required')
        .custom(async (images: string[], { req }): Promise<boolean> => {
            const product: ProductModel | null = await productsModel.findById(req.params?.id);
            if (!product) { deleteUploadedImages(images); return Promise.reject(new Error("Product not found")); };
            const imagesDifference: number = 5 - product.images.length;
            if (product.images.length >= 5) { deleteUploadedImages(images); return Promise.reject(new Error("every product has 5 images only, you can't add more")); };
            if (product.images.length + images.length > 5) { deleteUploadedImages(images); return Promise.reject(new Error(`every product has 5 images only, you can add only ${imagesDifference} more`)); };
            return true;
        }),
    validatorMiddleware
];

export const deleteProductValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid product id")
        .custom(async (id: string): Promise<boolean> => {
            const product: ProductModel | null = await productsModel.findById(id);
            if (!product) { return Promise.reject(new Error('Product Not found')); };
            const productImages: string[] = [];
            product?.images.forEach((imageUrl: string): void => {
                const image: string = imageUrl.split(`${process.env.Base_URL}/products/`)[1];
                productImages.push(image);
            });
            deleteUploadedImages(productImages);
            await shopsModel.findByIdAndUpdate(product.shop, { $inc: { productsMoney: -product.quantity * product.productPrice } }, { new: true });
            return true;
        }),
    validatorMiddleware
];

export const deleteUploadedImages = (images: string[]): void => {
    images.forEach((imageName: string): void => {
        const imagePath: string = `uploads/products/${imageName}`;
        fs.unlink(imagePath, (err): void => {
            if (err) { console.error(`Error deleting image ${imageName}: ${err}`); }
            else { console.log(`Successfully deleted image ${imageName}`); };
        });
    });
};