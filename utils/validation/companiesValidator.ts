import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { CityModel, GovernorateModel, Address } from "../../interfaces";

export const createCompanyValidator: express.RequestHandler[] = [
    check('name')
        .notEmpty().withMessage("product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('phone').optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
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

export const getCompanyValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid user id"),
    validatorMiddleware
];

export const updateCompanyValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid user id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('phone').optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
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