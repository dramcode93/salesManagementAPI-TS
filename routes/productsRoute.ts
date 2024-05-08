import { Router } from "express";
import { DeleteProduct, addProductCategory, addProductImages, createProduct, deleteProductImage, filterProducts, getProduct, getProducts, getProductsList, resizeImage, updateProduct, uploadProductImages } from "../controllers/products";
import { ProductImagesValidator, createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validation/productsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";

const productsRoute: Router = Router({ mergeParams: true });

productsRoute.route('/').get(filterProducts, getProducts);
productsRoute.use(protectRoutes, checkActive, checkShops);

productsRoute.route('/').post(allowedTo('admin'), uploadProductImages, resizeImage, addProductCategory, createProductValidator, createProduct);

productsRoute.get('/list', allowedTo('admin', 'user'), filterProducts, getProductsList);

productsRoute.route("/:id")
    .get(allowedTo('admin', 'user', 'customer'), getProductValidator, getProduct)
    .put(allowedTo('admin'), updateProductValidator, updateProduct)
    .delete(allowedTo('admin'), deleteProductValidator, DeleteProduct);

productsRoute.use(allowedTo('admin', 'user'));
productsRoute.route("/:id/images")
    .put(getProductValidator, uploadProductImages, resizeImage, ProductImagesValidator, addProductImages)
    .delete(getProductValidator, deleteProductImage);

export default productsRoute;