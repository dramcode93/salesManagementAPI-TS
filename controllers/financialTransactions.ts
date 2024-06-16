import express from "express";
import expressAsyncHandler from "express-async-handler";
import financialTransactionsModel from "../models/financialTransactionsModel";
import shopsModel from "../models/shopsModel";
import ApiErrors from "../utils/errors";
import { ShopModel, FinancialTransactionsModel, FilterData } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";

const getFinancialTransactions = getAll<FinancialTransactionsModel>(financialTransactionsModel, 'financialTransactions');
const getFinancialTransaction = getOne<FinancialTransactionsModel>(financialTransactionsModel, 'financialTransactions', '');

const createFinancialTransactions = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let money: number = 0;
    req.body.shop = req.user?.shop;
    if (req.body.transaction === "deposit") { money = req.body.money; }
    else if (req.body.transaction === "withdraw") {
        const shop: ShopModel | null = await shopsModel.findById(req.user?.shop);
        if (shop!.allMoney < req.body.money) { return next(new ApiErrors("you don't have enough money to withdraw", 400)); };
        money = -req.body.money;
    };
    const financialTransaction: FinancialTransactionsModel = await financialTransactionsModel.create(req.body);
    await shopsModel.findByIdAndUpdate(req.user?.shop, { $inc: { allMoney: money } }, { new: true });
    res.status(200).json({ data: financialTransaction });
});

const filterFinancialTransactions = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getFinancialTransactions, getFinancialTransaction, createFinancialTransactions, filterFinancialTransactions };