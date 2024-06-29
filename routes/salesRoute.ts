import { Router } from "express";
import { filterSales, getAllDaysSales, getAllMonthsSales, getAllYearsSales, getSpecificDaySales, getSpecificMonthSales, getSpecificYearSales } from "../controllers/sales";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { checkSubShops } from "../controllers/subShops";

const salesRoute: Router = Router();

salesRoute.use(protectRoutes, checkActive, allowedTo('admin', 'user'), checkShops, checkSubShops);

salesRoute.route('/daily').get(filterSales, getAllDaysSales)
salesRoute.route('/monthly').get(filterSales, getAllMonthsSales)
salesRoute.route('/yearly').get(filterSales, getAllYearsSales)

salesRoute.route("/daily/thisDay").get(getSpecificDaySales);
salesRoute.route("/monthly/thisMonth").get(getSpecificMonthSales);
salesRoute.route("/yearly/thisYear").get(getSpecificYearSales);

export default salesRoute;