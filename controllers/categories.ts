import express from "express";
import categoriesModel from "../models/categoriesModel";
import { CategoryModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getCategories = getAll<CategoryModel>(categoriesModel, 'categories');
const getCategoriesList = getAllList<CategoryModel>(categoriesModel, '');
const createCategory = createOne<CategoryModel>(categoriesModel);
const getCategory = getOne<CategoryModel>(categoriesModel, 'categories', '');
const updateCategory = updateOne<CategoryModel>(categoriesModel);
const DeleteCategory = deleteOne<CategoryModel>(categoriesModel);

const filterCategories = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getCategories, getCategoriesList, createCategory, getCategory, updateCategory, DeleteCategory, filterCategories };