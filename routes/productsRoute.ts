import { Router } from "express";
import { DeleteProduct, addProductCategory, createProduct, filterProducts, getProduct, getProducts, getProductsList, updateProduct } from "../controllers/products";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const productsRoute: Router = Router({ mergeParams: true });
productsRoute.use(protectRoutes, checkActive);

productsRoute.route('/')
    .get(allowedTo('admin', 'user'), filterProducts, getProducts)
    .post(allowedTo('admin'), addProductCategory, createProductValidator, createProduct);

productsRoute.get('/list', allowedTo('admin', 'user'), filterProducts, getProductsList);

productsRoute.use(allowedTo('admin'));
productsRoute.route("/:id")
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, DeleteProduct);

export default productsRoute;