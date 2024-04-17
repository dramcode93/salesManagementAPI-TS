import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import productsModel from "../../models/productsModel";
import customersModel from "../../models/customersModel";
import { BillProducts, CustomerModel, ProductModel } from "../../interfaces";

export const createBillValidator = [
    check('customer')
        .notEmpty().withMessage("Customer is required")
        .isMongoId().withMessage("invalid customer id")
        .custom(async (val: string): Promise<boolean> => {
            const customer: CustomerModel | null = await customersModel.findById(val);
            if (!customer) { return Promise.reject(new Error('customer does not exist')); };
            return true;
        }),
    check("products")
        .notEmpty().withMessage("Products are required")
        .isArray().withMessage("Products must be an array")
        .custom(async (products: BillProducts[]): Promise<boolean> => {
            await Promise.all(products.map(async (productData: BillProducts): Promise<void> => {
                const productId: ProductModel = productData.product;
                const product: ProductModel | null = await productsModel.findById(productId);
                if (!product) { throw new Error(`Product with id ${productId} not found`) };
                if (productData.productQuantity <= 0 || productData.productQuantity > product.quantity) { throw new Error(`Invalid quantity for product: ${product.name}`); };
            }));
            return true;
        }),
    validatorMiddleware,
];

export const getBillValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateBillValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check('customer').optional().isMongoId().withMessage("invalid customer id")
        .custom(async (val: string): Promise<boolean> => {
            const customer: CustomerModel | null = await customersModel.findById(val);
            if (!customer) { return Promise.reject(new Error('customer does not exist')); };
            return true;
        }),
    check("products").optional().isArray().withMessage("Products must be an array")
        .custom(async (products: BillProducts[]): Promise<boolean> => {
            await Promise.all(products.map(async (productData: BillProducts): Promise<void> => {
                const productId: ProductModel = productData.product;
                const product: ProductModel | null = await productsModel.findById(productId);
                if (!product) { throw new Error(`Product with id ${productId} not found`) };
                if (productData.productQuantity <= 0 || productData.productQuantity > product.quantity) { throw new Error(`Invalid quantity for product: ${product.name}`); };
            }));
            return true;
        }),
    validatorMiddleware,
];

export const deleteBillValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];