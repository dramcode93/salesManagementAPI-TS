import express from 'express';
import productsModel from "../models/productsModel";
import { FilterData, ProductModel } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getProducts = getAll<ProductModel>(productsModel, 'products');
const getProductsList = getAllList<ProductModel>(productsModel);
const createProduct = createOne<ProductModel>(productsModel);
const getProduct = getOne<ProductModel>(productsModel);
const updateProduct = updateOne<ProductModel>(productsModel);
const DeleteProduct = deleteOne<ProductModel>(productsModel);

const addProductCategory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.body.category) { req.body.category = req.params.categoryId }; next();
};

const filterProducts = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    if (req.params.categoryId) { filterData.category = req.params.categoryId };
    req.filterData = filterData;
    next();
};

export { getProducts, getProductsList, createProduct, getProduct, updateProduct, DeleteProduct, addProductCategory, filterProducts };