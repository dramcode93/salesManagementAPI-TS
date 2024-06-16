import express from "express";
import expressAsyncHandler from "express-async-handler";
import dailySubSalesModel from "../models/dailySubSalesModel";
import monthlySubSalesModel from "../models/monthlySubSalesModel";
import yearlySubSalesModel from "../models/yearlySubSalesModel";
import ApiErrors from "../utils/errors";
import { FilterData, SubSalesModel } from "../interfaces";
import { getAll } from "./refactorHandler";

const getAllDaysSubSales = getAll<SubSalesModel>(dailySubSalesModel, 'dailySubSales');
const getAllMonthsSubSales = getAll<SubSalesModel>(monthlySubSalesModel, 'monthlySubSales');
const getAllYearsSubSales = getAll<SubSalesModel>(yearlySubSalesModel, 'yearlySubSales');

const getSpecificDaySubSales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));
    const dailySubSales: SubSalesModel | null = await dailySubSalesModel.findOne({ shop: req.user?.shop, subShop: req.query.subShop, createdAt: { $gte: startOfDay, $lt: endOfDay } });
    if (!dailySubSales) { return next(new ApiErrors("there isn't daily sales today for this sub shop yet", 404)) };
    res.status(200).json({ data: dailySubSales });
});

const getSpecificMonthSubSales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const monthlySubSales: SubSalesModel | null = await monthlySubSalesModel.findOne({ shop: req.user?.shop, subShop: req.query.subShop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } });
    if (!monthlySubSales) { return next(new ApiErrors("there isn't monthly sales this month for this sub shop yet", 404)) };
    res.status(200).json({ data: monthlySubSales });
});

const getSpecificYearSubSales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const yearlySubSales: SubSalesModel | null = await yearlySubSalesModel.findOne({ shop: req.user?.shop, subShop: req.query.subShop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } });
    if (!yearlySubSales) { return next(new ApiErrors("there isn't yearly sales this year for this sub shop yet", 404)) };
    res.status(200).json({ data: yearlySubSales });
});

const filterSubSales = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    if (req.query.subShop) { filterData.subShop = req.query.subShop; };
    req.filterData = filterData;
    next();
};

export { getAllDaysSubSales, getAllMonthsSubSales, getAllYearsSubSales, getSpecificDaySubSales, getSpecificMonthSubSales, getSpecificYearSubSales, filterSubSales };