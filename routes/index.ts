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
import couponRoute from "./couponRoute";
import cartRoute from "./cartRoute";
import orderRoute from "./orderRoute"
import customersRoute from "./customersRoute";
import shopsRoute from "./shopsRoute";
import shopTypesRoute from "./shopTypesRoute";
import financialTransactionsRoute from "./financialTransactionsRoute";
import salesRoute from "./salesRoute";

const mountRoutes = (app: express.Application): void => {
    app.use('/api/categories', categoriesRoute);
    app.use('/api/products', productsRoute);
    app.use('/api/bills', billsRoute);
    app.use('/api/users', usersRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/governorates', governoratesRoute);
    app.use('/api/cities', citiesRoute);
    app.use('/api/coupon', couponRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/customers', customersRoute);
    app.use('/api/shops', shopsRoute);
    app.use('/api/shopTypes', shopTypesRoute);
    app.use('/api/financialTransactions', financialTransactionsRoute);
    app.use('/api/sales', salesRoute);
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => { next(new ApiErrors(`The router ${req.originalUrl} is not found`, 400)) });
    app.use(globalErrors);
};

export default mountRoutes;