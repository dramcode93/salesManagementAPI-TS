import express from "express";
import ApiErrors from "../utils/errors";
import globalErrors from "../middlewares/globalErrors";
import categoriesRoute from "./categoriesRoute";
import productsRoute from "./productsRoute";
import billsRoute from "../routes/billsRoute";
import usersRoute from "./usersRoute";
import authRoute from "./authRoute";
import governoratesRoute from "./governoratesRoute";
import citiesRoute from "./citiesRoute";

const mountRoutes = (app: express.Application) => {
    app.use('/api/categories', categoriesRoute);
    app.use('/api/products', productsRoute);
    app.use('/api/bills', billsRoute);
    app.use('/api/users', usersRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/governorates', governoratesRoute);
    app.use('/api/cities', citiesRoute);
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => { next(new ApiErrors(`The router ${req.originalUrl} is not found`, 400)) });
    app.use(globalErrors);
};

export default mountRoutes;