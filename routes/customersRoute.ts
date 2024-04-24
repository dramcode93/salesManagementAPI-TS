import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { deleteCustomer, createCustomer, filterCustomers, getCustomer, getCustomers, getCustomersList, updateCustomer } from "../controllers/customers";

const customersRoute: Router = Router();

customersRoute.use(protectRoutes, checkActive, allowedTo('admin', 'user'));

customersRoute.route('/')
    .get(filterCustomers, getCustomers)
    .post(createCustomer);

customersRoute.get('/list', filterCustomers, getCustomersList);

customersRoute.route("/:id")
    .get(getCustomer);
// .put(updateCustomer)
// .delete(deleteCustomer);

export default customersRoute;