import { Router } from "express";
import { DeleteCategory, createCategory, getCategories, getCategory, updateCategory } from "../controllers/categories";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validation/categoriesValidator";

const categoriesRoute: Router = Router();

categoriesRoute.route('/')
    .get(getCategories)
    .post(createCategoryValidator, createCategory)

categoriesRoute.route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, DeleteCategory)

export default categoriesRoute;