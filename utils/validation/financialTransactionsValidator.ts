import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createFinancialTransactionValidator: express.RequestHandler[] = [
    check('money').notEmpty().withMessage("money is required").isNumeric().withMessage("money must be a number"),
    check('transaction').notEmpty().withMessage("transaction is required"),
    check('reason').notEmpty().withMessage("reason is required").isLength({ min: 2, max: 150 }).withMessage("reason length must be between 2 and 150"),
    check('subShop').notEmpty().withMessage("sub Shop is required").isMongoId().withMessage("invalid sub shop id"),
    validatorMiddleware
];

export const getFinancialTransactionValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("invalid financial Transaction id"),
    validatorMiddleware
];