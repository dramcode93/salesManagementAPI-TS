import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { deleteCustomer, createCustomer, filterCustomers, getCustomer, getCustomers, getCustomersList, updateCustomer, addCustomerAddress, deleteCustomerAddress, addCustomerPhone, deleteCustomerPhone } from "../controllers/customers";
import { createCustomerValidator, customerAddressValidator, customerPhoneValidator, deleteCustomerValidator, getCustomerValidator, updateCustomerValidator } from "../utils/validation/customersValidator";

const customersRoute: Router = Router();

customersRoute.use(protectRoutes, checkActive, allowedTo('admin', 'user'));

customersRoute.route('/')
    .get(filterCustomers, getCustomers)
    .post(createCustomerValidator, createCustomer);

customersRoute.get('/list', filterCustomers, getCustomersList);

customersRoute.route("/:id")
    .get(getCustomerValidator, getCustomer)
    .put(updateCustomerValidator, updateCustomer)
    .delete(deleteCustomerValidator, deleteCustomer);

customersRoute.route("/:id/address")
    .put(customerAddressValidator, addCustomerAddress)
    .delete(customerAddressValidator, deleteCustomerAddress);

customersRoute.route("/:id/phone")
    .put(customerPhoneValidator, addCustomerPhone)
    .delete(customerPhoneValidator, deleteCustomerPhone);

export default customersRoute;