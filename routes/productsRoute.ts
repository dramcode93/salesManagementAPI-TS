import { Router } from "express";
import { DeleteProduct, addProductCategory, createProduct, filterProducts, getProduct, getProducts, getProductsList, updateProduct } from "../controllers/products";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidator";

const productsRoute: Router = Router({ mergeParams: true });

productsRoute.route('/')
    .get(filterProducts, getProducts)
    .post(addProductCategory, createProductValidator, createProduct);

productsRoute.get('/list', filterProducts, getProductsList);

productsRoute.route("/:id")
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, DeleteProduct);

export default productsRoute;