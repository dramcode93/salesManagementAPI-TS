import express from "express";
import CustomersModel from "../models/customersModel";
import { CustomerModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getCustomers = getAll<CustomerModel>(CustomersModel, 'customers');
const getCustomersList = getAllList<CustomerModel>(CustomersModel, '');
const createCustomer = createOne<CustomerModel>(CustomersModel);
const getCustomer = getOne<CustomerModel>(CustomersModel, 'customers');
const updateCustomer = updateOne<CustomerModel>(CustomersModel);
const deleteCustomer = deleteOne<CustomerModel>(CustomersModel);

const filterCustomers = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getCustomers, getCustomersList, createCustomer, getCustomer, updateCustomer, deleteCustomer, filterCustomers };