import { Router } from "express";
import { createFinancialTransactions, filterFinancialTransactions, getFinancialTransaction, getFinancialTransactions } from "../controllers/financialTransactions";
import { createFinancialTransactionValidator, getFinancialTransactionValidator } from "../utils/validation/financialTransactionsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { checkSubShops } from "../controllers/subShops";

const financialTransactionsRoute: Router = Router();

financialTransactionsRoute.use(protectRoutes, checkActive, allowedTo('admin'), checkShops, checkSubShops);

financialTransactionsRoute.route('/')
    .get(filterFinancialTransactions, getFinancialTransactions)
    .post(createFinancialTransactionValidator, createFinancialTransactions);

financialTransactionsRoute.route("/:id").get(getFinancialTransactionValidator, getFinancialTransaction);

export default financialTransactionsRoute;