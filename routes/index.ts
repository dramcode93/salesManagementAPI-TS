import express from "express";
import ApiErrors from "../utils/errors";
import globalErrors from "../middlewares/globalErrors";
import categoriesRoute from "./categoriesRoute";
import productsRoute from "./productsRoute";

const mountRoutes = (app: express.Application) => {
    app.use('/api/categories', categoriesRoute);
    app.use('/api/products', productsRoute);
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => { next(new ApiErrors(`The router ${req.originalUrl} is not found`, 400)) });
    app.use(globalErrors);
}

export default mountRoutes;
