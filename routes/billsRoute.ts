import { Router } from "express";
import { createBill, deleteBill, filterBills, getBill, getBills, updateBill } from "../controllers/bills";
import { createBillValidator, deleteBillValidator, getBillValidator, updateBillValidator } from "../utils/validation/billsValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";

const billsRoute = Router();
billsRoute.use(protectRoutes, checkActive, checkShops);

billsRoute.route('/')
    .get(allowedTo('admin', 'user'), filterBills, getBills)
    .post(allowedTo('admin', 'user'), createBillValidator, createBill);

billsRoute.use(allowedTo('admin'));

billsRoute.route('/:id')
    .get(getBillValidator, getBill)
    // .put(updateBillValidator, updateBill)
    .delete(deleteBillValidator, deleteBill);

billsRoute.get('/:id/userBills', filterBills, getBills);

export default billsRoute;