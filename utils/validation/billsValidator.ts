import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import productsModel from "../../models/productsModel";
import { BillProducts, ProductModel } from "../../interfaces";

export const createBillValidator = [
    check('customerName')
        .notEmpty().withMessage("Customer Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Customer Name length must be between 2 and 50"),
    check("customerAddress").optional().isLength({ max: 200 }).withMessage("the max length of Customer Address is 200"),
    check("phone").optional().isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
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
    check('customerName').optional().isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 and 50"),
    check("customerAddress").optional().isLength({ max: 200 }).withMessage("the max length of Customer Address is 200"),
    check("phone").optional().isMobilePhone("ar-EG").withMessage("InValid Phone Number only accept EG Number "),
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