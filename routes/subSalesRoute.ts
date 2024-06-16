import { Router } from "express";
import { filterSubSales, getAllDaysSubSales, getAllMonthsSubSales, getAllYearsSubSales, getSpecificDaySubSales, getSpecificMonthSubSales, getSpecificYearSubSales } from "../controllers/subSales";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { checkSubShops } from "../controllers/subShops";

const subSalesRoute: Router = Router();

subSalesRoute.use(protectRoutes, checkActive, allowedTo('admin'), checkShops, checkSubShops);

subSalesRoute.route('/daily').get(filterSubSales, getAllDaysSubSales)
subSalesRoute.route('/monthly').get(filterSubSales, getAllMonthsSubSales)
subSalesRoute.route('/yearly').get(filterSubSales, getAllYearsSubSales)

subSalesRoute.route("/daily/thisDay").get(getSpecificDaySubSales);
subSalesRoute.route("/monthly/thisMonth").get(getSpecificMonthSubSales);
subSalesRoute.route("/yearly/thisYear").get(getSpecificYearSubSales);

export default subSalesRoute;