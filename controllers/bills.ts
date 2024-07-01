import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ApiErrors from "../utils/errors";
import billsModel from "../models/billsModel";
import productsModel from "../models/productsModel";
import customersModel from "../models/customersModel";
import { deleteOne, getAll, getOne } from "./refactorHandler";
import { BillModel, BillProducts, CustomerModel, FilterData, ProductModel } from "../interfaces";

const filterBills = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    if (req.user?.role === "user") { filterData.subShop = req.user.subShop };
    if (req.params.id) { filterData.user = req.params.id; };
    next();
};

const getBills = getAll(billsModel, 'bills');
const getBill = getOne(billsModel, 'bills', '');
const deleteBill = deleteOne(billsModel);

interface UpdateProduct { quantity: number; sold: number };

const createBill = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const products: BillProducts[] = req.body.products;
        if (req.user?.role === "user") { req.body.subShop = req.user.subShop };

        const bulkOptions = await Promise.all(products.map(async (productData: BillProducts) => {
            // * Find the subShopIndex
            const selectedProduct: ProductModel | null = await productsModel.findById(productData.product).session(session);
            if (!selectedProduct) { throw new Error(`Product with ID ${productData.product} not found`); }
            const subShopIndex: number = selectedProduct.subShops.findIndex((shop: any) => shop.subShop._id.toString() === req.body.subShop);
            if (selectedProduct.subShops[subShopIndex].quantity < productData.productQuantity) { throw new Error(`not enough quantity to this product`); };

            // * Build the update object
            const updateObject: any = { $inc: { quantity: -productData.productQuantity, sold: productData.productQuantity } };
            if (subShopIndex > -1) { updateObject.$inc[`subShops.${subShopIndex}.quantity`] = -productData.productQuantity; }
            else { throw new Error(`sub Shop with ID ${req.body.subShop} not found`); };
            return {
                updateOne: {
                    filter: { _id: productData.product },
                    update: updateObject,
                    session: session
                }
            };
        }));
        await productsModel.bulkWrite(bulkOptions, { session });
        req.body.user = req.user?._id;
        req.body.shop = req.user?.shop;
        const createdBills = await billsModel.create([req.body], { session });
        let bill: BillModel | null = createdBills[0];
        const customer: CustomerModel | null = await customersModel.findById(bill.customer).session(session);
        bill = await billsModel.findByIdAndUpdate(bill._id, { customerName: customer?.name, code: bill._id.toString() }, { new: true, session })
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ data: bill });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, stack: error.stack });
    };
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

export { getBills, getBill, createBill, updateBill, deleteBill, filterBills };