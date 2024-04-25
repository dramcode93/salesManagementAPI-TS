import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import shopTypesModel from "../../models/shopTypesModel";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { Address, CityModel, GovernorateModel, ShopTypeModel } from "../../interfaces";

export const createShopValidator = [
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

export const getShopValidator = [
    check('id').isMongoId().withMessage("invalid shop id"),
    validatorMiddleware
];

export const updateShopValidator = [
    check('id').isMongoId().withMessage("invalid shop id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    validatorMiddleware
];

export const deleteShopValidator = [
    check('id').isMongoId().withMessage("invalid shop id"),
    validatorMiddleware
];