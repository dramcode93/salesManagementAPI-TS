import categoriesModel from "../models/categoriesModel";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

export const getCategories = getAll(categoriesModel, 'categories');
export const getCategoriesList = getAllList(categoriesModel);
export const createCategory = createOne(categoriesModel);
export const getCategory = getOne(categoriesModel);
export const updateCategory = updateOne(categoriesModel);
export const DeleteCategory = deleteOne(categoriesModel);
