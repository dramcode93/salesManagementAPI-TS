import categoriesModel from "../models/categoriesModel";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler";

export const getCategories = getAll(categoriesModel);
export const createCategory = createOne(categoriesModel);
export const getCategory = getOne(categoriesModel);
export const updateCategory = updateOne(categoriesModel);
export const DeleteCategory = deleteOne(categoriesModel);
