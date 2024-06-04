import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import shopTypesModel from "../../models/shopTypesModel";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { Address, CityModel, GovernorateModel, ShopTypeModel } from "../../interfaces";

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
    check('deliveryService').notEmpty().withMessage("delivery service is required").isBoolean().withMessage("delivery Service must be boolean value"),
    check('shippingPrice').optional().isNumeric().withMessage("shipping Price must be number"),
    check('phone').notEmpty().withMessage("phone number can't be empty").isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    check('address').notEmpty().withMessage("shop address is required")
        .custom(async (address: Address): Promise<boolean> => {
            const governorate: GovernorateModel | null = await governoratesModel.findById(address.governorate);
            if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            const city: CityModel | null = await citiesModel.findById(address.city);
            if (!city) { return Promise.reject(new Error('city not found')); };
            if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            // ! array of address
            // await Promise.all(address.map(async (item: Address): Promise<void> => {
            //     const governorate: GovernorateModel | null = await governoratesModel.findById(item.governorate);
            //     if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            //     const city: CityModel | null = await citiesModel.findById(item.city);
            //     if (!city) { return Promise.reject(new Error('city not found')); };
            //     if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            // }));
            return true;
        }),
    validatorMiddleware
];

export const getShopValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid shop id"),
    validatorMiddleware
];

export const updateShopValidator: express.RequestHandler[] = [
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('deliveryService').optional().isBoolean().withMessage("delivery Service must be boolean value")
        .custom((deliveryService: boolean, { req }) => {
            if (deliveryService === false) { req.body.shippingPrice = 0 };
            return true;
        }),
    check('shippingPrice').optional().isNumeric().withMessage("shipping Price must be number"),
    validatorMiddleware
];

export const deleteShopValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid shop id"),
    validatorMiddleware
];

export const shopAddressValidator: express.RequestHandler[] = [
    check('address').notEmpty().withMessage('Invalid address')
        .custom(async (address: Address): Promise<boolean> => {
            const governorate: GovernorateModel | null = await governoratesModel.findById(address.governorate);
            if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            const city: CityModel | null = await citiesModel.findById(address.city);
            if (!city) { return Promise.reject(new Error('city not found')); };
            if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            // ! array of address
            // await Promise.all(address.map(async (item: Address): Promise<void> => {
            //     const governorate: GovernorateModel | null = await governoratesModel.findById(item.governorate);
            //     if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            //     const city: CityModel | null = await citiesModel.findById(item.city);
            //     if (!city) { return Promise.reject(new Error('city not found')); };
            //     if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            // }));
            return true;
        }),
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

export const shopPhoneValidator: express.RequestHandler[] = [
    check('phone').notEmpty().withMessage("phone number can't be empty").isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validatorMiddleware
];