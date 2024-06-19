import express from "express";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/errors";
import { SubShopModel } from "../interfaces";
import { createOne, getAll, getOne } from "./refactorHandler";
import subShopsModel from "../models/subShopsModel";

const getSubShops = getAll<SubShopModel>(subShopsModel, 'subShops');
const getSubShop = getOne<SubShopModel>(subShopsModel, 'subShops', '');
const createSubShop = createOne<SubShopModel>(subShopsModel)

const updateSubShop = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOneAndUpdate({ _id: req.params.id, shop: req.user?.shop }, { name: req.body.name, address: req.body.address, shippingPriceInside: req.body.shippingPriceInside, shippingPriceOutside: req.body.shippingPriceOutside, deliveryService: req.body.deliveryService }, { new: true });
    if (!subShop) { return next(new ApiErrors(`No sub shop for this id`, 404)); };
    res.status(201).json({ data: subShop });
});

const checkSubShops = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.user?.role !== "customer") {
        const subShops = await subShopsModel.find({ shop: req.user?.shop });
        if (subShops.length === 0) { return next(new ApiErrors("you can't do this action without sub shop", 400)); };
    };
    next();
});

const addSubShopPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.params.id, shop: req.user?.shop });
    if (!subShop) { return next(new ApiErrors('no sub shop for this Id', 404)); };
    await subShopsModel.findByIdAndUpdate(subShop._id, { $addToSet: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'sub shop phone added successfully' });
});

const deleteSubShopPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.params.id, shop: req.user?.shop });
    if (!subShop) { return next(new ApiErrors('no sub shop for this Id', 404)); };
    await subShopsModel.findByIdAndUpdate(subShop._id, { $pull: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'sub shop phone deleted successfully' });
});

const addSubShopPayment = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.params.id, shop: req.user?.shop });
    if (!subShop) { return next(new ApiErrors('no sub shop for this Id', 404)); };
    await subShopsModel.findByIdAndUpdate(subShop._id, { $addToSet: { onlinePaymentMethods: req.body.onlinePaymentMethods } }, { new: true });
    res.status(200).json({ message: 'sub shop phone added successfully' });
});

const deleteSubShopPayment = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.params.id, shop: req.user?.shop });
    if (!subShop) { return next(new ApiErrors('no sub shop for this Id', 404)); };
    await subShopsModel.findByIdAndUpdate(subShop._id, { $pull: { onlinePaymentMethods: req.body.onlinePaymentMethods } }, { new: true });
    res.status(200).json({ message: 'sub shop phone deleted successfully' });
});

const changeSubShopActivation = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.params.id, shop: req.user?.shop });
    if (!subShop) { return next(new ApiErrors('no sub shop for this Id', 404)); };
    await subShopsModel.findByIdAndUpdate(subShop._id, { active: req.body.active }, { new: true });
    res.status(200).json({ message: 'sub shop activation updated successfully' });
});

export { getSubShops, getSubShop, createSubShop, updateSubShop, checkSubShops, addSubShopPhone, deleteSubShopPhone, changeSubShopActivation, addSubShopPayment, deleteSubShopPayment };