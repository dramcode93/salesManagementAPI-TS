import categoriesModel from "../models/categoriesModel";
import { CategoryModel } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getCategories = getAll<CategoryModel>(categoriesModel, 'categories');
const getCategoriesList = getAllList<CategoryModel>(categoriesModel);
const createCategory = createOne<CategoryModel>(categoriesModel);
const getCategory = getOne<CategoryModel>(categoriesModel);
const updateCategory = updateOne<CategoryModel>(categoriesModel);
const DeleteCategory = deleteOne<CategoryModel>(categoriesModel);

export { getCategories, getCategoriesList, createCategory, getCategory, updateCategory, DeleteCategory };