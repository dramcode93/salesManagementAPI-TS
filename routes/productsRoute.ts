import { Router } from "express";
import { DeleteProduct, createProduct, getProduct, getProducts, getProductsList, updateProduct } from "../controllers/products";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidator";

const productsRoute: Router = Router({ mergeParams: true });

productsRoute.route('/')
    .get(getProducts)
    .post(createProductValidator, createProduct);

productsRoute.get('/list', getProductsList);

productsRoute.route("/:id")
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, DeleteProduct);

export default productsRoute;