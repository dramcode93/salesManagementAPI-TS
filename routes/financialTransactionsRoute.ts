import { Router } from "express";
import { createFinancialTransactions, getFinancialTransaction, getFinancialTransactions } from "../controllers/financialTransactions";
import { createFinancialTransactionValidator, getFinancialTransactionValidator } from "../utils/validation/financialTransactionsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";

const financialTransactionsRoute: Router = Router();

financialTransactionsRoute.use(protectRoutes, checkActive, checkShops);

financialTransactionsRoute.route('/')
    .get(allowedTo('admin', 'user'), getFinancialTransactions)
    .post(allowedTo('admin'), createFinancialTransactionValidator, createFinancialTransactions);

financialTransactionsRoute.route("/:id").get(allowedTo('admin', 'user'), getFinancialTransactionValidator, getFinancialTransaction);

export default financialTransactionsRoute;