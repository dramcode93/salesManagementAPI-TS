import { Router } from "express";
import { DeleteCategory, createCategory, filterCategories, getCategories, getCategoriesList, getCategory, updateCategory } from "../controllers/categories";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validation/categoriesValidator";
import productsRoute from "./productsRoute";

const categoriesRoute: Router = Router();

categoriesRoute.use('/:categoryId/products', productsRoute)

categoriesRoute.route('/')
    .get(filterCategories, getCategories)
    .post(createCategoryValidator, createCategory)

categoriesRoute.get('/list', filterCategories, getCategoriesList);

categoriesRoute.route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, DeleteCategory)

export default categoriesRoute;