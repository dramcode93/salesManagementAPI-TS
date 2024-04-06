import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const loginValidator = [
    check('username').notEmpty().withMessage('name is Required'),
    check("password")
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14'),
    validatorMiddleware,
];

export const resetPasswordValidator = [
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