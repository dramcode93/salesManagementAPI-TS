import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import bcrypt from "bcryptjs";
import usersModel from "../../models/usersModel";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { CityModel, GovernorateModel, UserModel, Address } from "../../interfaces";

export const createUserValidator = [
    check('username')
        .notEmpty().withMessage('username is required')
        .isLength({ min: 2, max: 20 }).withMessage('username must be between 2 and 20 characters')
        .custom(async (value: string): Promise<boolean> => {
            const user: UserModel | null = await usersModel.findOne({ username: value });
            if (user) { return Promise.reject(new Error('Username already exists')); };
            return true;
        }),
    check('name')
        .notEmpty().withMessage("product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('email').optional().isEmail().withMessage('Invalid email'),
    check('phone').optional().isArray().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    check('address').optional().isArray().withMessage('Invalid address')
        .custom(async (address: Address[]): Promise<boolean> => {
            await Promise.all(address.map(async (item: Address): Promise<void> => {
                const governorate: GovernorateModel | null = await governoratesModel.findById(item.governorate);
                if (!governorate) { return Promise.reject(new Error('governorate not found')); };
                const city: CityModel | null = await citiesModel.findById(item.city);
                if (!city) { return Promise.reject(new Error('city not found')); };
                if (city.governorate.toString() !== governorate._id.toString()) { return Promise.reject(new Error('city not belong to this governorate')); };
            }));
            return true;
        }),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('password must be between 6 and 14')
        .custom((password: string, { req }): boolean => {
            if (password !== req.body.passwordConfirmation) { throw new Error("password don't match"); };
            return true;
        }),
    check('passwordConfirmation')
        .notEmpty().withMessage('password confirmation is required')
        .isLength({ min: 6, max: 14 }).withMessage('password confirmation must be between 6 and 14'),
    validatorMiddleware
];

export const getUserValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    validatorMiddleware
];

export const updateUserValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('name').optional().isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50"),
    check('email').optional().isEmail().withMessage('Invalid email'),
    validatorMiddleware
];

export const userActiveValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('active').notEmpty().withMessage('active is required').isBoolean().withMessage('Active field must be a Boolean'),
    validatorMiddleware
];

export const changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("passwordConfirmation")
        .notEmpty().withMessage("You Must Enter Password Confirm")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    check("password")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val: string, { req }): Promise<boolean> => {
            const user: UserModel | null = await usersModel.findById(req.params!.id);
            if (!user) { throw new Error("there is No User For This Id"); }
            if (val !== req.body.passwordConfirmation) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];

export const updateLoggedUserValidator = [
    check("name").optional().isLength({ min: 2, max: 50 }).withMessage("Name should be 2 : 50 char "),
    check("email").optional().isEmail().withMessage("InValid Email Address"),
    validatorMiddleware,
];

export const updateLoggedUserPasswordValidator = [
    check("currentPassword")
        .notEmpty().withMessage(" You Must Enter Your current Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password must be at least 6 char and at most 14 char"),
    check("confirmPassword")
        .notEmpty().withMessage("You Must Enter Password Confirm")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    check("password")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val, { req }): Promise<boolean> => {
            const user: UserModel = req.user;
            const isCorrectPassword: boolean = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCorrectPassword) { throw new Error("current Password is wrong"); };
            if (val !== req.body.confirmPassword) { throw new Error("Passwords do not match"); };
            return true;
        }),
    validatorMiddleware,
];