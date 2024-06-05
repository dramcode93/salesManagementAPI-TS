import { Router } from "express";
import { createFinancialTransactions, filterFinancialTransactions, getFinancialTransaction, getFinancialTransactions } from "../controllers/financialTransactions";
import { createFinancialTransactionValidator, getFinancialTransactionValidator } from "../utils/validation/financialTransactionsValidator";
import { CreateFinancialTransactionDto, GetFinancialTransactionDto } from "../utils/validation/class/financialTransactionsValidator";
import classValidatorMiddleware from "../middlewares/classValidatorMiddleware";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";

const financialTransactionsRoute: Router = Router();

financialTransactionsRoute.use(protectRoutes, checkActive, allowedTo('admin'), checkShops);

financialTransactionsRoute.route('/')
    .get(filterFinancialTransactions, getFinancialTransactions)
    .post(classValidatorMiddleware(CreateFinancialTransactionDto), createFinancialTransactions);

financialTransactionsRoute.route("/:id").get(classValidatorMiddleware(GetFinancialTransactionDto), getFinancialTransaction);

export default financialTransactionsRoute;