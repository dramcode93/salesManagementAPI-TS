import { Router } from "express";
import { filterSales, getAllDaysSales, getAllMonthsSales, getAllYearsSales, getSpecificDaySales, getSpecificMonthSales, getSpecificYearSales } from "../controllers/sales";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { getSalesValidator } from "../utils/validation/salesValidator";

const salesRoute: Router = Router();

salesRoute.use(protectRoutes, checkActive, allowedTo('admin'), checkShops);

salesRoute.route('/daily').get(filterSales, getAllDaysSales)
salesRoute.route('/monthly').get(filterSales, getAllMonthsSales)
salesRoute.route('/yearly').get(filterSales, getAllYearsSales)

salesRoute.route("/daily/:id").get(getSalesValidator, getSpecificDaySales);
salesRoute.route("/monthly/:id").get(getSalesValidator, getSpecificMonthSales);
salesRoute.route("/yearly/:id").get(getSalesValidator, getSpecificYearSales);

export default salesRoute;