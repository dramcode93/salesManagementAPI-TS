import express from "express";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import billsModel from "../models/billsModel";
import productsModel from "../models/productsModel";
import { deleteOne, getAll, getOne } from "./refactorHandler";
import { BillModel, BillProducts, FilterData } from "../interfaces";

const filterBills = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    if (req.params.id) { filterData.user = req.params.id; };
    next();
};

const getBills = getAll(billsModel, 'bills');
const getBill = getOne(billsModel, 'bills');
const deleteBill = deleteOne(billsModel);

interface UpdateProduct { quantity: number; sold: number };

const createBill = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const products: BillProducts[] = req.body.products;
    products.map(async (productData: BillProducts): Promise<void> => { await productsModel.findByIdAndUpdate(productData.product, { $inc: { quantity: -productData.productQuantity, sold: productData.productQuantity } }); });
    req.body.user = req.user?._id;
    req.body.shop = req.user?.shop;
    const bill: BillModel = await billsModel.create(req.body);
    res.status(200).json({ data: bill });
});

const updateBill = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const products: BillProducts[] = req.body.products;
    if (products) {
        const bill: BillModel | null = await billsModel.findById(req.params.id);
        if (!bill) { return next(new ApiErrors(`No bill for this id`, 404)); };
        const arrayOfValues = products.map(obj => Object.values(obj)); // * Check if product in bill sent in body or no
        const flattenedValues = arrayOfValues.flat();
        bill?.products.forEach(async (checkProduct: BillProducts): Promise<void> => {
            const productId: any = checkProduct?.product?._id;
            if (productId !== null && !(flattenedValues.includes(productId.toString()))) {
                const updateFields: UpdateProduct = { quantity: checkProduct?.productQuantity, sold: -checkProduct?.productQuantity, };
                await productsModel.findByIdAndUpdate(productId, { $inc: updateFields });
            };
        });

        // * update bill
        products.map(async (productData: BillProducts): Promise<void> => {
            let quantityDifference: number; // * update products quantity
            const existingProduct: BillProducts | undefined = bill?.products.find((billProduct: BillProducts) => billProduct?.product?._id.toString() === productData.product.toString());
            if (existingProduct) { quantityDifference = -(existingProduct.productQuantity - productData.productQuantity); }
            else { quantityDifference = productData.productQuantity; };
            const updateFields: UpdateProduct = { quantity: - quantityDifference, sold: quantityDifference, };
            await productsModel.findByIdAndUpdate(productData.product, { $inc: updateFields });
        });
    };
    req.body.user = req.user?._id;
    req.body.shop = req.user?.shop;
    const updatedBill: BillModel | null = await billsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await updatedBill?.save();
    res.status(200).json({ data: updatedBill });
});

// !  @desc      Old Code

// const createBill = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
//     const products: BillProducts[] = req.body.products;
//     let totalAmount: number = 0;
//     const productDetailsPromises = products.map(async (productData: BillProducts): Promise<BillProducts> => {
//         const productId: ProductModel = productData.product;
//         const product: ProductModel | null = await productsModel.findById(productId); // * Get product
//         await productsModel.findByIdAndUpdate(productId, { $inc: { quantity: -productData.productQuantity, sold: productData.productQuantity } }); // * Update the product quantity in the database
//         const totalPrice: number = product!.sellingPrice * productData.productQuantity;
//         totalAmount = totalAmount + (product!.sellingPrice * productData.productQuantity);
//         return { product: productData.product, productQuantity: productData.productQuantity, totalPrice };
//     });
//     const productDetails: BillProducts[] = await Promise.all(productDetailsPromises);
//     req.body.products = productDetails; // * Update req.body.products with detailed information
//     req.body.totalAmount = totalAmount;
//     req.body.remainingAmount = totalAmount - req.body.paidAmount;
//     req.body.user = req.user?._id;
//     if (req.user?.role === 'admin') { req.body.adminUser = req.user?._id; }
//     else { req.body.adminUser = req.user?.adminUser; };
//     const bill: BillModel = await billsModel.create(req.body);
//     res.status(200).json({ data: bill });
// });

// const updateBill = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
//     interface UpdateProduct { quantity: number; sold: number };
//     const products: BillProducts[] = req.body.products;
//     if (products) {
//         const bill: BillModel | null = await billsModel.findById(req.params.id);
//         let totalAmount: number = 0;
//         const arrayOfValues = products.map(obj => Object.values(obj)); // * Check if product in bill sent in body or no
//         const flattenedValues = arrayOfValues.flat();
//         bill?.products.forEach(async (checkProduct: BillProducts): Promise<void> => {
//             const productId: any = checkProduct?.product?._id;
//             if (productId !== null && !(flattenedValues.includes(productId.toString()))) {
//                 const updateFields: UpdateProduct = { quantity: checkProduct?.productQuantity, sold: -checkProduct?.productQuantity, };
//                 await productsModel.findByIdAndUpdate(productId, { $inc: updateFields });
//             };
//         });

//         // * update bill
//         const productDetailsPromises = products.map(async (productData: BillProducts): Promise<BillProducts> => {
//             const productId: ProductModel = productData.product;
//             const product: ProductModel | null = await productsModel.findById(productId); // * Get product
//             let quantityDifference: number; // * update products quantity
//             const existingProduct: BillProducts | undefined = bill?.products.find((billProduct: BillProducts) => billProduct?.product?._id.toString() === productId.toString());
//             if (existingProduct) { quantityDifference = -(existingProduct.productQuantity - productData.productQuantity); }
//             else { quantityDifference = productData.productQuantity; };
//             const updateFields: UpdateProduct = { quantity: - quantityDifference, sold: quantityDifference, };
//             await productsModel.findByIdAndUpdate(productId, { $inc: updateFields });
//             const totalPrice: number = product!.sellingPrice * productData.productQuantity;
//             totalAmount = totalAmount + (product!.sellingPrice * productData.productQuantity);
//             return { product: productData.product, productQuantity: productData.productQuantity, totalPrice };
//         });
//         const productDetails: BillProducts[] = await Promise.all(productDetailsPromises);
//         req.body.products = productDetails; // * Update req.body.products with detailed information
//         req.body.totalAmount = totalAmount;
//         req.body.remainingAmount = totalAmount - req.body.paidAmount;
//     };
//     req.body.user = req.user?._id;
//     if (req.user?.role === 'admin') { req.body.adminUser = req.user._id; }
//     else { req.body.adminUser = req.user?.adminUser; };
//     const updatedBill: BillModel | null = await billsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json({ data: updatedBill });
// });

export { getBills, getBill, createBill, updateBill, deleteBill, filterBills };