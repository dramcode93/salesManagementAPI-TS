import { Router } from "express";
import { DeleteCategory, createCategory, filterCategories, getCategories, getCategoriesList, getCategory, updateCategory } from "../controllers/categories";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validation/categoriesValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import productsRoute from "./productsRoute";

const categoriesRoute: Router = Router();

categoriesRoute.use('/:categoryId/products', productsRoute);
categoriesRoute.use(protectRoutes, checkActive, checkShops);

categoriesRoute.route('/')
    .get(allowedTo('admin', 'user'), filterCategories, getCategories)
    .post(allowedTo('admin'), createCategoryValidator, createCategory);

categoriesRoute.get('/list', allowedTo('admin', 'user'), filterCategories, getCategoriesList);

categoriesRoute.use(allowedTo('admin'))
categoriesRoute.route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, DeleteCategory);

export default categoriesRoute;