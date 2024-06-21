import express from "express";
import expressAsyncHandler from "express-async-handler";
import shopsModel from "../models/shopsModel";
import usersModel from "../models/usersModel";
import ApiErrors from "../utils/errors";
import { ShopModel } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";
import { uploadSingleImage } from "../middlewares/uploadFiles";
import sharp from "sharp";
import { deleteUploadedShopImage } from "../utils/validation/shopsValidator";

const uploadShopImage = uploadSingleImage("image");

const resizeShopImage = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.file) {
        let imageName: string = ``;
        const shop: ShopModel | null = await shopsModel.findById(req.params.id);
        if (shop?.image) {
            const image: string = shop.image.split(`${process.env.Base_URL}/shops/`)[1];
            deleteUploadedShopImage(image);
        };
        if (req.body.name) { imageName = `shop-${req.body.name}-${Date.now()}.jpeg`; }
        else { imageName = `shop-${shop?.name}-${Date.now()}.jpeg` };
        await sharp(req.file.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/shops/${imageName}`);
        req.body.image = imageName;
    };
    next();
});

const getShops = getAll<ShopModel>(shopsModel, 'shops');
const getMyShop = getOne<ShopModel>(shopsModel, 'shops', '');

const createShop = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const shop: ShopModel = await shopsModel.create(req.body);
    await usersModel.findByIdAndUpdate(req.user?._id, { shop: shop._id }, { new: true });
    res.status(201).json({ data: shop });
});

const updateShop = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findByIdAndUpdate(req.params.id, { name: req.body.name, image: req.body.image }, { new: true });
    if (!shop) { return next(new ApiErrors(`No shop for this id`, 404)); };
    res.status(201).json({ data: shop });
});

const addShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $addToSet: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type added successfully' });
});

const deleteShopType = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const shop: ShopModel | null = await shopsModel.findById(req.params.id);
    if (!shop) { return next(new ApiErrors('no shop for this Id', 404)); };
    await shopsModel.findByIdAndUpdate(shop._id, { $pull: { type: req.body.type } }, { new: true });
    res.status(200).json({ message: 'shop type deleted successfully' });
});

const checkShops = (req: express.Request, res: express.Response, next: express.NextFunction): void => { if (req.user?.role !== "customer") { if (!req.user?.shop) { return next(new ApiErrors("you can't do this action without shop", 400)); }; }; next(); };
const getShopId = (req: express.Request, res: express.Response, next: express.NextFunction): void => { req.params.id = (req.user!.shop).toString(); next(); };
const checkCreateShop = (req: express.Request, res: express.Response, next: express.NextFunction): void => { if (req.user?.role === "admin" && req.user?.shop) { return next(new ApiErrors("you already have shop you can't create another", 400)); }; next(); };

export { getShops, createShop, getShopId, getMyShop, updateShop, checkShops, checkCreateShop, addShopType, deleteShopType, uploadShopImage, resizeShopImage };