import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import productsModel from "../models/productsModel";
import { FilterData, ProductModel } from "../interfaces";
import { uploadMultiImages } from '../middlewares/uploadFiles';
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getProducts = getAll<ProductModel>(productsModel, 'products');
const getProductsList = getAllList<ProductModel>(productsModel, '');
const createProduct = createOne<ProductModel>(productsModel);
const getProduct = getOne<ProductModel>(productsModel, 'products');
const updateProduct = updateOne<ProductModel>(productsModel);
const DeleteProduct = deleteOne<ProductModel>(productsModel);

const addProductCategory = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (!req.body.category) { req.body.category = req.params.categoryId }; next();
};

const filterProducts = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    if (req.user?.role !== 'customer') { filterData.shop = req.user?.shop; };
    if (req.params.categoryId) { filterData.category = req.params.categoryId };
    req.filterData = filterData;
    next();
};

const uploadProductImages = uploadMultiImages([{ name: "images", maxCount: 5 }]);

const resizeImage = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.files) {
        if (req.files.images) {
            req.body.images = [];
            await Promise.all(req.files.images.map(async (img: any, index: number): Promise<void> => {
                const imageName: string = `product-${req.body.name}-${Date.now()}N${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(850, 800)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                req.body.images.push(imageName);
            }));
        };
    };
    next();
});

export { getProducts, getProductsList, createProduct, getProduct, updateProduct, DeleteProduct, addProductCategory, filterProducts, uploadProductImages, resizeImage };