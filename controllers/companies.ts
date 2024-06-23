import express from "express";
import companiesModel from "../models/companiesModel";
import { CompanyModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getAllList, getOne, updateOne } from "./refactorHandler";

const getCompanies = getAll<CompanyModel>(companiesModel, 'companies');
const getCompaniesList = getAllList<CompanyModel>(companiesModel, '');
const createCompany = createOne<CompanyModel>(companiesModel);
const getCompany = getOne<CompanyModel>(companiesModel, 'companies', '');
const updateCompany = updateOne<CompanyModel>(companiesModel);
const deleteCompany = deleteOne<CompanyModel>(companiesModel);

const filterCompanies = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.shop = req.user?.shop;
    req.filterData = filterData;
    next();
};

export { getCompanies, getCompaniesList, createCompany, getCompany, updateCompany, deleteCompany, filterCompanies };