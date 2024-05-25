import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const getOrderValidator = [
    check('id').isMongoId().withMessage("Invalid order Id"),
    validatorMiddleware,
];