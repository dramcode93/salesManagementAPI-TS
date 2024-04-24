import { Router } from "express";
import { DeleteProduct, addProductCategory, createProduct, filterProducts, getProduct, getProducts, getProductsList, resizeImage, updateProduct, uploadProductImages } from "../controllers/products";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const productsRoute: Router = Router({ mergeParams: true });
productsRoute.use(protectRoutes, checkActive);

productsRoute.route('/')
    .get(allowedTo('admin', 'user', 'customer'), filterProducts, getProducts)
    .post(allowedTo('admin'), addProductCategory, createProductValidator, uploadProductImages, resizeImage, createProduct);

productsRoute.get('/list', allowedTo('admin', 'user'), filterProducts, getProductsList);

productsRoute.route("/:id")
    .get(allowedTo('admin', 'user', 'customer'), getProductValidator, getProduct)
    .put(allowedTo('admin'), updateProductValidator, updateProduct)
    .delete(allowedTo('admin'), deleteProductValidator, DeleteProduct);

export default productsRoute;