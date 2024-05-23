import express from "express";
import expressAsyncHandler from "express-async-handler";
import shopsModel from "../models/shopsModel";
import usersModel from "../models/usersModel";
import ApiErrors from "../utils/errors";
import { ShopModel } from "../interfaces";
import { deleteOne, getAll, getOne } from "./refactorHandler";

const getShops = getAll<ShopModel>(shopsModel, 'shops');
const getShop = getOne<ShopModel>(shopsModel, 'shops', '');
const DeleteShop = deleteOne<ShopModel>(shopsModel);

const createShop = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const shop: ShopModel = await shopsModel.create(req.body);
    await usersModel.findByIdAndUpdate(req.user?._id, { shop: shop._id }, { new: true });
    res.status(201).json({ data: shop });
});

const getMyShop = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors(`No shop for this id`, 404)); };
    res.status(201).json({ data: shop });
});

const updateShop = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findByIdAndUpdate(req.user?.shop, { name: req.body.name }, { new: true });
    if (!shop) { return next(new ApiErrors(`No shop for this id`, 404)); };
    res.status(201).json({ data: shop });
});

const checkShops = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.user?.role !== "customer") { if (!req.user?.shop) { return next(new ApiErrors("you can't do this action without shop", 400)); }; };
    next();
};

const checkCreateShop = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.user?.role === "admin" && req.user?.shop) { return next(new ApiErrors("you already have shop you can't create another", 400)); };
    next();
};

const addShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type added successfully' });
});

const addShopAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'shop address added successfully' });
});

const addShopPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'shop phone added successfully' });
});

const deleteShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type deleted successfully' });
});

const deleteShopAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'shop address deleted successfully' });
});

const deleteShopPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'shop phone deleted successfully' });
});

export { getShops, createShop, getShop, getMyShop, updateShop, DeleteShop, checkShops, checkCreateShop, addShopType, addShopAddress, addShopPhone, deleteShopType, deleteShopAddress, deleteShopPhone };