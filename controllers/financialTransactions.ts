import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import financialTransactionsModel from "../models/financialTransactionsModel";
import shopsModel from "../models/shopsModel";
import subShopsModel from "../models/subShopsModel";
import ApiErrors from "../utils/errors";
import { FinancialTransactionsModel, FilterData, SubShopModel } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";

const getFinancialTransactions = getAll<FinancialTransactionsModel>(financialTransactionsModel, 'financialTransactions');
const getFinancialTransaction = getOne<FinancialTransactionsModel>(financialTransactionsModel, 'financialTransactions', '');

const createFinancialTransactions = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let money: number = 0;
        req.body.shop = req.user?.shop;
        const subShop: SubShopModel | null = await subShopsModel.findOne({ _id: req.body.subShop, shop: req.user?.shop }).session(session);
        if (!subShop) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiErrors("No sub shop for this id", 404))
        };
        if (req.body.transaction === "deposit") { money = req.body.money; }
        else if (req.body.transaction === "withdraw") {
            if (subShop.allMoney < req.body.money) {
                await session.abortTransaction();
                session.endSession();
                return next(new ApiErrors("you don't have enough money to withdraw", 400));
            };
            money = -req.body.money;
        };
        const createdFinancialTransaction = await financialTransactionsModel.create([req.body], { session });
        const financialTransaction: FinancialTransactionsModel = createdFinancialTransaction[0];
        await subShopsModel.findOneAndUpdate({ _id: req.body.subShop, shop: req.user?.shop }, { $inc: { allMoney: money } }, { new: true, session });
        await shopsModel.findByIdAndUpdate(req.user?.shop, { $inc: { allMoney: money } }, { new: true, session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ data: financialTransaction });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

const filterFinancialTransactions = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getFinancialTransactions, getFinancialTransaction, createFinancialTransactions, filterFinancialTransactions };