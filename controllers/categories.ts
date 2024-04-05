import express from "express";
import categoriesModel from "../models/categoriesModel";
import { CategoryModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getCategories = getAll<CategoryModel>(categoriesModel, 'categories');
const getCategoriesList = getAllList<CategoryModel>(categoriesModel);
const createCategory = createOne<CategoryModel>(categoriesModel);
const getCategory = getOne<CategoryModel>(categoriesModel);
const updateCategory = updateOne<CategoryModel>(categoriesModel);
const DeleteCategory = deleteOne<CategoryModel>(categoriesModel);

const filterCategories = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let filterData: FilterData = {};
    if (req.user?.role === 'admin') { filterData.adminUser = req.user._id } else { filterData.adminUser = req.user?.adminUser };
    req.filterData = filterData;
    next();
};

export { getCategories, getCategoriesList, createCategory, getCategory, updateCategory, DeleteCategory, filterCategories };