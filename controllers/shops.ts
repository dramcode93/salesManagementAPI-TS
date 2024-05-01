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

export { getShops, getShopsList, createShop, getShop, updateShop, DeleteShop, checkShops, checkCreateShop };