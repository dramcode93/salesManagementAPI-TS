import express from "express";
import expressAsyncHandler from "express-async-handler";
import dailySalesModel from "../models/dailySalesModel";
import monthlySalesModel from "../models/monthlySalesModel";
import yearlySalesModel from "../models/yearlySalesModel";
import ApiErrors from "../utils/errors";
import { FilterData, SalesModel } from "../interfaces";
import { getAll } from "./refactorHandler";

const getAllDaysSales = getAll<SalesModel>(dailySalesModel, 'dailySales');
const getAllMonthsSales = getAll<SalesModel>(monthlySalesModel, 'monthlySales');
const getAllYearsSales = getAll<SalesModel>(yearlySalesModel, 'yearlySales');

const getSpecificDaySales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));
    const dailySales: SalesModel | null = await dailySalesModel.findOne({ shop: req.user?.shop, createdAt: { $gte: startOfDay, $lt: endOfDay } });
    if (!dailySales) { return next(new ApiErrors("there isn't daily sales today yet", 404)) };
    res.status(200).json({ data: dailySales });
});

const getSpecificMonthSales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const monthlySales: SalesModel | null = await monthlySalesModel.findOne({ shop: req.user?.shop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } });
    if (!monthlySales) { return next(new ApiErrors("there isn't monthly sales this month yet", 404)) };
    res.status(200).json({ data: monthlySales });
});

const getSpecificYearSales = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const date: Date = new Date();
    const yearlySales: SalesModel | null = await yearlySalesModel.findOne({ shop: req.user?.shop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } });
    if (!yearlySales) { return next(new ApiErrors("there isn't yearly sales this year yet", 404)) };
    res.status(200).json({ data: yearlySales });
});

const filterSales = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getAllDaysSales, getAllMonthsSales, getAllYearsSales, getSpecificDaySales, getSpecificMonthSales, getSpecificYearSales, filterSales };