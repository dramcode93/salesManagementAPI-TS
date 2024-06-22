import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import ApiErrors from '../utils/errors';
import productsModel from "../models/productsModel";
import shopsModel from '../models/shopsModel';
import subShopsModel from '../models/subShopsModel';
import { FilterData, ProductModel, SubShopModel } from "../interfaces";
import { uploadMultiImages } from '../middlewares/uploadFiles';
import { deleteUploadedImages } from '../utils/validation/productsValidator';
import { deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getProducts = getAll<ProductModel>(productsModel, 'products');
const getProductsList = getAllList<ProductModel>(productsModel, '');
const getProduct = getOne<ProductModel>(productsModel, 'products', '');
const updateProduct = updateOne<ProductModel>(productsModel);
const DeleteProduct = deleteOne<ProductModel>(productsModel);

const createProduct = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    req.body.shop = req.user?.shop;
    const { quantity, subShops } = req.body;
    const totalSubShopQuantity = subShops.reduce((acc: number, subShop: { subShop: string, quantity: number }) => acc + subShop.quantity, 0);
    if (quantity !== totalSubShopQuantity) { return next(new ApiErrors("Quantity does not match the sum of quantities in subShops", 400)); };
    const product: ProductModel = await productsModel.create(req.body);
    await shopsModel.findByIdAndUpdate(product.shop, { $inc: { productsMoney: product.quantity * product.productPrice } }, { new: true });
    // ! const updatePromises = subShops.map((subShop: { subShop: string, quantity: number }) => { return subShopsModel.findByIdAndUpdate(subShop.subShop, { $inc: { productsMoney: subShop.quantity * req.body.productPrice } }, { new: true }); });
    // ! await Promise.all(updatePromises);
    const bulkOperations = subShops.map((subShop: { subShop: string, quantity: number }) => ({
        updateOne: {
            filter: { _id: subShop.subShop },
            update: { $inc: { productsMoney: subShop.quantity * req.body.productPrice } }
        }
    }));
    await subShopsModel.bulkWrite(bulkOperations);
    res.status(200).json({ data: product });
});

const updateQuantity = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const subShops: { subShop: string, quantity: number } = req.body.subShops;
    if (!subShops || !subShops.subShop || !subShops.quantity || subShops.quantity < 0) { return next(new ApiErrors("Invalid request body", 400)); };
    const product: ProductModel | null = await productsModel.findById(req.params.id);
    if (!product) { return next(new ApiErrors("Product not found", 404)); };
    let newQuantity: number = 0;
    const subShopIndex: number = product.subShops.findIndex(shop => shop.subShop.toString() === subShops.subShop);
    if (subShopIndex === -1) {
        newQuantity = subShops.quantity;
        await productsModel.findByIdAndUpdate(req.params.id, { $addToSet: { subShops: subShops }, $inc: { quantity: newQuantity } }, { new: true });
    }
    else {
        newQuantity = subShops.quantity - product.subShops[subShopIndex].quantity;
        await productsModel.findByIdAndUpdate(req.params.id, { $inc: { quantity: newQuantity, [`subShops.${subShopIndex}.quantity`]: newQuantity } }, { new: true });
    };
    await subShopsModel.findByIdAndUpdate(subShops.subShop, { $inc: { productsMoney: product.productPrice * newQuantity } }, { new: true });
    await shopsModel.findByIdAndUpdate(product.shop, { $inc: { productsMoney: product.productPrice * newQuantity } }, { new: true });
    res.status(200).json({ data: "product quantity updated successfully" });
});

const transportQuantity = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const fromSubShop: SubShopModel | null = await subShopsModel.findById(req.body.from);
    const toSubShop: SubShopModel | null = await subShopsModel.findById(req.body.to);
    const product: ProductModel | null = await productsModel.findById(req.params.id);
    if (!product || !fromSubShop || !toSubShop) { return next(new ApiErrors("Product or sub shop not found", 404)); };
    const fromSubShopIndex: number = product.subShops.findIndex(shop => shop.subShop.toString() === req.body.from.toString());
    const toSubShopIndex: number = product.subShops.findIndex(shop => shop.subShop.toString() === req.body.to.toString());
    if (fromSubShopIndex === -1 || toSubShopIndex === -1) { return next(new ApiErrors("SubShop not found in product", 404)); };
    await productsModel.findByIdAndUpdate(req.params.id, { $inc: { [`subShops.${fromSubShopIndex}.quantity`]: -req.body.quantity, [`subShops.${toSubShopIndex}.quantity`]: req.body.quantity } }, { new: true });
    await subShopsModel.findByIdAndUpdate(req.body.from, { $inc: { productsMoney: - product.productPrice * req.body.quantity } }, { new: true });
    await subShopsModel.findByIdAndUpdate(req.body.to, { $inc: { productsMoney: product.productPrice * req.body.quantity } }, { new: true });
    res.status(200).json({ data: "quantity of product transported successfully" });
});

const addProductCategory = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    if (!req.body.category) { req.body.category = req.params.categoryId }; next();
};

const filterProducts = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    if (req.user) { if (req.user.role !== 'customer') { filterData.shop = req.user?.shop; }; };
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
    res.status(200).json({ data: product });
});

const deleteProductImage = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const product: ProductModel | null = await productsModel.findById(req.params.id);
    if (!product) { return next(new ApiErrors('no product for this Id', 404)); };
    await productsModel.findByIdAndUpdate(product._id, { $pull: { images: req.body.images } }, { new: true });
    const productImages: string[] = [];
    productImages.push(req.body.images);
    deleteUploadedImages(productImages);
    res.status(200).json({ data: product });
});

export { getProducts, getProductsList, createProduct, getProduct, updateProduct, updateQuantity, transportQuantity, DeleteProduct, addProductCategory, filterProducts, uploadProductImages, resizeImage, addProductImages, deleteProductImage };