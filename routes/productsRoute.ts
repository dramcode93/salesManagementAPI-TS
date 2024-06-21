import { Router } from "express";
import { DeleteProduct, addProductCategory, addProductImages, createProduct, deleteProductImage, filterProducts, getProduct, getProducts, getProductsList, resizeImage, transportQuantity, updateProduct, updateQuantity, uploadProductImages } from "../controllers/products";
import { ProductImagesValidator, createProductValidator, deleteProductValidator, getProductValidator, transportProductQuantityValidator, updateProductValidator } from "../utils/validation/productsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { checkSubShops } from "../controllers/subShops";

const productsRoute: Router = Router({ mergeParams: true });

productsRoute.route('/customers').get(filterProducts, getProducts);
productsRoute.route('/customers/:id').get(getProductValidator, getProduct);
productsRoute.use(protectRoutes, checkActive, checkShops, checkSubShops);

productsRoute.route('/')
    .get(allowedTo('admin', 'user'), filterProducts, getProducts)
    .post(allowedTo('admin'), uploadProductImages, resizeImage, addProductCategory, createProductValidator, createProduct);

productsRoute.get('/list', allowedTo('admin', 'user'), filterProducts, getProductsList);

productsRoute.route("/:id")
    .get(allowedTo('admin', 'user'), getProductValidator, getProduct)
    .put(allowedTo('admin'), updateProductValidator, updateProduct)
    .delete(allowedTo('admin'), deleteProductValidator, DeleteProduct);

productsRoute.route("/:id/updateQuantity").put(allowedTo('admin'), getProductValidator, updateQuantity);
productsRoute.route("/:id/transportQuantity").put(allowedTo('admin'), transportProductQuantityValidator, transportQuantity);

productsRoute.use(allowedTo('admin', 'user'));
productsRoute.route("/:id/images")
    .put(getProductValidator, uploadProductImages, resizeImage, ProductImagesValidator, addProductImages)
    .delete(getProductValidator, deleteProductImage);

export default productsRoute;