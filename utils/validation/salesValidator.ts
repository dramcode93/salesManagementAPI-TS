import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getSalesValidator = [
    check('id').isMongoId().withMessage("invalid Sales id"),
    validatorMiddleware
];