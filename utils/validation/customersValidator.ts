import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";

export const createCustomerValidator = [
    check('name')
        .notEmpty().withMessage("Customer Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Customer Name length must be between 2 and 50"),
    check("address").optional().isLength({ max: 200 }).withMessage("the max length of Customer Address is 200"),
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