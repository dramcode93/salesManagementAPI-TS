import express from "express";
import categoriesRoute from "./categoriesRoute";
import globalErrors from "../middlewares/globalErrors";
import ApiErrors from "../utils/errors";

const mountRoutes = (app: express.Application) => {
    app.use('/api/categories', categoriesRoute)
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => { next(new ApiErrors(`The router ${req.originalUrl} is not found`, 400)) });
    app.use(globalErrors);
}

export default mountRoutes;
