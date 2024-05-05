import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware";
import carts from "../../models/cartModel";
import productModel from "../../models/productsModel"
import { ProductModel, CartModel, BillProducts, CouponModel } from "../../interfaces";

export const createProductInCartValidator = [
    check("productId")
        .notEmpty().withMessage("Products are required")
        .custom(async (cartItems: BillProducts[] | any, { req }): Promise<boolean> => {
            const productId: string = req.body.productId;
            const product: ProductModel | null = await productModel.findById(productId);
            if (!product) { throw new Error(`Product with id ${productId} not found`) };
            if (product!.quantity > cartItems.productQuantity) {
                throw new Error(`invalid quantity for this product `)
            }
            return true
        })


    , validatorMiddleware
];

export const getLoggedUserCartValidator = [
    check('id').isMongoId().withMessage("Invalid Id")
    , validatorMiddleware
];

export const updateCartItemQuantityValidator = [
    check('id').isMongoId().withMessage("invalid product id"),
    check('productQuantity').notEmpty().withMessage("product quantity is required")
        .custom(async (val: any, { req }): Promise<boolean> => {
            const productQuantity: number = req.body.productQuantity;
            const productId: string = req.params?.id;
            const product: any = await productModel.findById(productId);
            if (product?.quantity <= 0 || product?.quantity < productQuantity) {
                throw new Error(`invalid quantity for this product:${req.params?.id}`);
            }
            return true;
        }),

    validatorMiddleware
];

export const removeSpecificCartItemValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const clearLoggedUserCartValidator = [
    check('id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];