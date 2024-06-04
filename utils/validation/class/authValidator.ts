import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import usersModel from "../../models/usersModel";
import governoratesModel from "../../models/governoratesModel";
import citiesModel from "../../models/citiesModel";
import { Address, CityModel, GovernorateModel, UserModel } from "../../interfaces";

export const signupValidator: express.RequestHandler[] = [
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
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('phone').notEmpty().withMessage('phone is required').isMobilePhone('ar-EG').withMessage('Invalid phone number'),
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

export const loginValidator: express.RequestHandler[] = [
    check('username').notEmpty().withMessage('name is Required'),
    check("password")
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14'),
    validatorMiddleware,
];

export const resetPasswordValidator: express.RequestHandler[] = [
    check("confirmNewPassword")
        .notEmpty().withMessage("You Must Enter New Password Confirmation")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char"),
    check("newPassword")
        .notEmpty().withMessage("You Must Enter New Password")
        .isLength({ min: 6, max: 14 }).withMessage("Password Confirmation must be at least 6 char and at most 14 char")
        .custom(async (val: string, { req }): Promise<boolean> => {
            if (val !== req.body.confirmNewPassword) { throw new Error("Passwords do not match"); }
            return true;
        }),
    validatorMiddleware,
];