import { check } from "express-validator";
import { Address, CityModel, GovernorateModel } from "../../interfaces";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createCustomerValidator = [
    check('name')
        .notEmpty().withMessage("Customer Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Customer Name length must be between 2 and 50"),
    check('address').optional()
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
    check("phone").optional().isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
    validatorMiddleware,
];

export const getCustomerValidator = [
    check('id').isMongoId().withMessage("Invalid customer Id"),
    validatorMiddleware,
];

export const updateCustomerValidator = [
    check("id").isMongoId().withMessage("Invalid customer Id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50"),
    check("address").optional().isLength({ max: 200 }).withMessage("the max length of Customer Address is 200"),
    check("phone").optional().isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
    validatorMiddleware,
];

export const deleteCustomerValidator = [
    check('id').isMongoId().withMessage("Invalid customer Id"),
    validatorMiddleware,
];