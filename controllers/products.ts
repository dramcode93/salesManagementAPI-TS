import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import ApiErrors from '../utils/errors';
import productsModel from "../models/productsModel";
import { FilterData, ProductModel } from "../interfaces";
import { uploadMultiImages } from '../middlewares/uploadFiles';
import { deleteUploadedImages } from '../utils/validation/productsValidator';
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
    if (req.params.shopId) { filterData.shop = req.params.shopId }; // * for customers in e-commerce to get shop products
    req.filterData = filterData;
    next();
};

const uploadProductImages = uploadMultiImages([{ name: "images", maxCount: 5 }]);

const resizeImage = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.files) {
        if (req.files.images) {
            req.body.images = [];
            await Promise.all(req.files.images.map(async (img: any, index: number): Promise<void> => {
                let imageName: string = ``;
                if (req.body.name) { imageName = `product-${req.body.name}-${Date.now()}N${index + 1}.jpeg`; }
                else {
                    const product: ProductModel | null = await productsModel.findById(req.params.id);
                    imageName = `product-${product?.name}-${Date.now()}N${index + 1}.jpeg`;
                };
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

const addProductImages = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const product: ProductModel | null = await productsModel.findById(req.params.id);
    if (!product) { return next(new ApiErrors('no product for this Id', 404)); };
    await productsModel.findByIdAndUpdate(product._id, { $addToSet: { images: req.body.images } }, { new: true });
    res.status(200).json({ product });
});

const deleteProductImage = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const product: ProductModel | null = await productsModel.findById(req.params.id);
    if (!product) { return next(new ApiErrors('no product for this Id', 404)); };
    await productsModel.findByIdAndUpdate(product._id, { $pull: { images: req.body.images } }, { new: true });
    const productImages: string[] = [];
    productImages.push(req.body.images);
    deleteUploadedImages(productImages);
    res.status(200).json({ product });
});

export { getProducts, getProductsList, createProduct, getProduct, updateProduct, DeleteProduct, addProductCategory, filterProducts, uploadProductImages, resizeImage, addProductImages, deleteProductImage };