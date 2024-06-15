import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { Address, CityModel, GovernorateModel } from "../../interfaces";

export const createSubShopValidator: express.RequestHandler[] = [
    check('name')
        .notEmpty().withMessage("sub shop name is required")
        .isLength({ min: 2, max: 50 }).withMessage("shop name length must be between 2 and 50"),
    check('deliveryService').notEmpty().withMessage("delivery service is required").isBoolean().withMessage("delivery Service must be boolean value"),
    check('shippingPrice').optional().isNumeric().withMessage("shipping Price must be number"),
    check('phone').notEmpty().withMessage("phone number can't be empty").isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    check('address').notEmpty().withMessage("sub shop address is required")
        .custom(async (address: Address): Promise<boolean> => {
            const governorate: GovernorateModel | null = await governoratesModel.findById(address.governorate);
            if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            const city: CityModel | null = await citiesModel.findById(address.city);
            if (!city) { return Promise.reject(new Error('city not found')); };
            if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            return true;
        }),
    validatorMiddleware
];

export const getSubShopValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid sub shop id"),
    validatorMiddleware
];

export const updateSubShopValidator: express.RequestHandler[] = [
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('deliveryService').optional().isBoolean().withMessage("delivery Service must be boolean value")
        .custom((deliveryService: boolean, { req }) => {
            if (deliveryService === false) { req.body.shippingPrice = 0 };
            return true;
        }),
    check('shippingPrice').optional().isNumeric().withMessage("shipping Price must be number"),
    check('address').optional()
        .custom(async (address: Address): Promise<boolean> => {
            const governorate: GovernorateModel | null = await governoratesModel.findById(address.governorate);
            if (!governorate) { return Promise.reject(new Error('governorate not found')); };
            const city: CityModel | null = await citiesModel.findById(address.city);
            if (!city) { return Promise.reject(new Error('city not found')); };
            if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            return true;
        }),
    validatorMiddleware
];

export const subShopPhoneValidator: express.RequestHandler[] = [
    check('phone').notEmpty().withMessage("phone number can't be empty").isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validatorMiddleware
];

export const subShopActiveValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid sub shop id"),
    check('active').notEmpty().withMessage('active is required').isBoolean().withMessage('Active field must be a Boolean'),
    validatorMiddleware
];