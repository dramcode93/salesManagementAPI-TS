import express from "express";
import categoriesRoute from "./categoriesRoute";

const mountRoutes = (app: express.Application) => {
    app.use('/api/categories', categoriesRoute)
}

export default mountRoutes;
