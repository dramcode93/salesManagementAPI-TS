import express from "express";
import dailySalesModel from "../models/dailySalesModel";
import monthlySalesModel from "../models/monthlySalesModel";
import yearlySalesModel from "../models/yearlySalesModel";
import { FilterData, SalesModel } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";

const getAllDaysSales = getAll<SalesModel>(dailySalesModel, 'dailySales');
const getSpecificDaySales = getOne<SalesModel>(dailySalesModel, 'dailySales', '');
const getAllMonthsSales = getAll<SalesModel>(monthlySalesModel, 'monthlySales');
const getSpecificMonthSales = getOne<SalesModel>(monthlySalesModel, 'monthlySales', '');
const getAllYearsSales = getAll<SalesModel>(yearlySalesModel, 'yearlySales');
const getSpecificYearSales = getOne<SalesModel>(yearlySalesModel, 'yearlySales', '');

const filterSales = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getAllDaysSales, getAllMonthsSales, getAllYearsSales, getSpecificDaySales, getSpecificMonthSales, getSpecificYearSales, filterSales };