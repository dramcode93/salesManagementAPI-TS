import { Router } from "express";
import { DeleteCategory, createCategory, filterCategories, getCategories, getCategoriesList, getCategory, updateCategory } from "../controllers/categories";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validation/categoriesValidator";
import { CreateCategoryDto, DeleteCategoryDto, GetCategoryDto, UpdateCategoryDto } from "../utils/validation/class/categoriesValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import productsRoute from "./productsRoute";
import classValidatorMiddleware from "../middlewares/classValidatorMiddleware";

const categoriesRoute: Router = Router();

categoriesRoute.use('/:categoryId/products', productsRoute);
categoriesRoute.use(protectRoutes, checkActive, checkShops);

categoriesRoute.route('/')
    .get(allowedTo('admin', 'user'), filterCategories, getCategories)
    .post(allowedTo('admin'), classValidatorMiddleware(CreateCategoryDto), createCategory);

categoriesRoute.get('/list', allowedTo('admin', 'user'), filterCategories, getCategoriesList);

categoriesRoute.use(allowedTo('admin'))
categoriesRoute.route("/:id")
    .get(classValidatorMiddleware(GetCategoryDto), getCategory)
    .put(classValidatorMiddleware(UpdateCategoryDto), updateCategory)
    .delete(deleteCategoryValidator, DeleteCategory);

export default categoriesRoute;