import express from "express";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getOrderValidator: express.RequestHandler[] = [
    check('id').isMongoId().withMessage("Invalid order Id"),
    validatorMiddleware,
];