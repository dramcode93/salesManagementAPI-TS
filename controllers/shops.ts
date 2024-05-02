import express from "express";
import expressAsyncHandler from "express-async-handler";
import shopsModel from "../models/shopsModel";
import usersModel from "../models/usersModel";
import ApiErrors from "../utils/errors";
import { ShopModel, FilterData, UserModel } from "../interfaces";
import { deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";
import { sanitizeUser } from "../utils/sanitization";

const getShops = getAll<ShopModel>(shopsModel, 'shops');
const getShopsList = getAllList<ShopModel>(shopsModel, '');
const getShop = getOne<ShopModel>(shopsModel, 'shops');
const updateShop = updateOne<ShopModel>(shopsModel);
const DeleteShop = deleteOne<ShopModel>(shopsModel);

const createShop = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const shop: ShopModel = await shopsModel.create(req.body);
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user?._id, { shop: shop._id }, { new: true });
    res.status(201).json({ data: shop, user: sanitizeUser(user) });
});

const filterShops = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

const checkShops = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.user?.role !== "customer") { if (!req.user?.shop) { return next(new ApiErrors("you can't do this action without shop", 400)); }; };
    next();
};

const checkCreateShop = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (req.user?.role === "admin" && req.user?.shop) { return next(new ApiErrors("you already have shop you can't create another", 400)); };
    next();
};

const addShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type added successfully' });
});

const addShopAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'shop address added successfully' });
});

const deleteShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type deleted successfully' });
});

const deleteShopAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'shop address deleted successfully' });
});

export { getShops, getShopsList, createShop, getShop, updateShop, DeleteShop, checkShops, checkCreateShop, addShopType, addShopAddress, deleteShopType, deleteShopAddress };