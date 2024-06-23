import { Router } from "express";
import { deleteCompany, createCompany, filterCompanies, getCompanies, getCompaniesList, getCompany, updateCompany } from "../controllers/companies";
import { createCompanyValidator, getCompanyValidator, updateCompanyValidator } from "../utils/validation/companiesValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";
import { checkShops } from "../controllers/shops";
import { checkSubShops } from "../controllers/subShops";

const companiesRoute: Router = Router();

companiesRoute.use(protectRoutes, checkActive, checkShops, checkSubShops);

companiesRoute.route('/')
    .get(allowedTo('admin', 'user'), filterCompanies, getCompanies)
    .post(allowedTo('admin'), createCompanyValidator, createCompany);

companiesRoute.get('/list', allowedTo('admin', 'user'), filterCompanies, getCompaniesList);

companiesRoute.use(allowedTo('admin'))
companiesRoute.route("/:id")
    .get(getCompanyValidator, getCompany)
    .put(updateCompanyValidator, updateCompany);
    // .delete(getCompanyValidator, deleteCompany);

export default companiesRoute;