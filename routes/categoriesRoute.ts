import { Router } from "express";
import { DeleteCategory, createCategory, getCategories, getCategory, updateCategory } from "../controllers/categories";

const categoriesRoute: Router = Router();

categoriesRoute.route('/')
    .get(getCategories)
    .post(createCategory)

    categoriesRoute.route("/:id")
    .get(getCategory)
    .put(updateCategory)
    .delete(DeleteCategory)

export default categoriesRoute;