import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { deleteCustomer, createCustomer, filterCustomers, getCustomer, getCustomers, getCustomersList, updateCustomer } from "../controllers/customers";
import { createCustomerValidator, getCustomerValidator } from "../utils/validation/customersValidator";

const customersRoute: Router = Router();

customersRoute.use(protectRoutes, checkActive, allowedTo('admin', 'user'));

customersRoute.route('/')
    .get(filterCustomers, getCustomers)
    .post(createCustomerValidator, createCustomer);

customersRoute.get('/list', filterCustomers, getCustomersList);

customersRoute.route("/:id")
    .get(getCustomerValidator, getCustomer);
// .put(updateCustomer)
// .delete(deleteCustomer);

export default customersRoute;