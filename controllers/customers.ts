import express from "express";
import expressAsyncHandler from "express-async-handler";
import CustomersModel from "../models/customersModel";
import ApiErrors from "../utils/errors";
import { CustomerModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne } from "./refactorHandler";

const getCustomers = getAll<CustomerModel>(CustomersModel, 'customers');
const getCustomersList = getAllList<CustomerModel>(CustomersModel, '');
const createCustomer = createOne<CustomerModel>(CustomersModel);
const getCustomer = getOne<CustomerModel>(CustomersModel, 'customers', 'bills');
const deleteCustomer = deleteOne<CustomerModel>(CustomersModel);

const updateCustomer = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const customer: CustomerModel | null = await CustomersModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!customer) { return next(new ApiErrors(`No customer for this id`, 404)); };
    res.status(201).json({ data: customer });
});

const addCustomerAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const customer: CustomerModel | null = await CustomersModel.findById(req.params.id);
    if (!customer) { return next(new ApiErrors('no customer for this Id', 404)); };
    if (req.user?.shop.toString() !== customer.shop.toString()) { return next(new ApiErrors('you can update your customers only', 400)); };
    await CustomersModel.findByIdAndUpdate(customer._id, { $addToSet: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'customer address added successfully' });
});

const deleteCustomerAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const customer: CustomerModel | null = await CustomersModel.findById(req.params.id);
    if (!customer) { return next(new ApiErrors('no customer for this Id', 404)); };
    if (req.user?.shop.toString() !== customer.shop.toString()) { return next(new ApiErrors('you can update your customers only', 400)); };
    await CustomersModel.findByIdAndUpdate(customer._id, { $pull: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'customer address deleted successfully' });
});

const addCustomerPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const customer: CustomerModel | null = await CustomersModel.findById(req.params.id);
    if (!customer) { return next(new ApiErrors('no customer for this Id', 404)); };
    if (req.user?.shop.toString() !== customer.shop.toString()) { return next(new ApiErrors('you can update your customers only', 400)); };
    await CustomersModel.findByIdAndUpdate(customer._id, { $addToSet: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'customer phone added successfully' });
});

const deleteCustomerPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const customer: CustomerModel | null = await CustomersModel.findById(req.params.id);
    if (!customer) { return next(new ApiErrors('no customer for this Id', 404)); };
    if (req.user?.shop.toString() !== customer.shop.toString()) { return next(new ApiErrors('you can update your customers only', 400)); };
    await CustomersModel.findByIdAndUpdate(customer._id, { $pull: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'customer phone deleted successfully' });
});

const filterCustomers = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getCustomers, getCustomersList, createCustomer, getCustomer, updateCustomer, deleteCustomer, addCustomerAddress, deleteCustomerAddress, addCustomerPhone, deleteCustomerPhone, filterCustomers };