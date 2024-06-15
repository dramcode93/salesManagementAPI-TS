import fs from "fs";
import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import shopTypesModel from "../../models/shopTypesModel";
import { ShopTypeModel } from "../../interfaces";

export const createShopValidator: express.RequestHandler[] = [
    check('name')
        .notEmpty().withMessage("shop name is required")
        .isLength({ min: 2, max: 50 }).withMessage("shop name length must be between 2 and 50"),
    check('type')
        .notEmpty().withMessage('shop type is required')
        .isMongoId().withMessage('Invalid shop type id')
        .custom(async (typeId: string): Promise<boolean> => {
            const shopType: ShopTypeModel | null = await shopTypesModel.findById(typeId);
            if (!shopType) { return Promise.reject(new Error('shop type does not exist')); };
            return true;
        }),
    validatorMiddleware
];

export const updateShopValidator: express.RequestHandler[] = [
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const shopTypeValidator: express.RequestHandler[] = [
    check('type')
        .notEmpty().withMessage('shop type is required')
        .isMongoId().withMessage('Invalid shop type id')
        .custom(async (typeId: string): Promise<boolean> => {
            const shopType: ShopTypeModel | null = await shopTypesModel.findById(typeId);
            if (!shopType) { return Promise.reject(new Error('shop type does not exist')); };
            return true;
        }),
    validatorMiddleware
];


export const deleteUploadedShopImage = (image: string): void => {
    const imagePath: string = `uploads/shops/${image}`;
    fs.unlink(imagePath, (err): void => {
        if (err) { console.error(`Error deleting image ${image}: ${err}`); }
        else { console.log(`Successfully deleted image ${image}`); };
    });
};