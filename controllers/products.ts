import productsModel from "../models/productsModel";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

export const getProducts = getAll(productsModel, 'products');
export const getProductsList = getAllList(productsModel);
export const createProduct = createOne(productsModel);
export const getProduct = getOne(productsModel);
export const updateProduct = updateOne(productsModel);
export const DeleteProduct = deleteOne(productsModel);