import shopTypesModel from "../models/shopTypesModel";
import { ShopTypeModel } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getShopTypes = getAll<ShopTypeModel>(shopTypesModel, 'shopTypes');
const getShopTypesList = getAllList<ShopTypeModel>(shopTypesModel, '');
const createShopType = createOne<ShopTypeModel>(shopTypesModel);
const getShopType = getOne<ShopTypeModel>(shopTypesModel, 'shopTypes');
const updateShopType = updateOne<ShopTypeModel>(shopTypesModel);
const deleteShopType = deleteOne<ShopTypeModel>(shopTypesModel);

export { getShopTypes, getShopTypesList, createShopType, getShopType, updateShopType, deleteShopType };