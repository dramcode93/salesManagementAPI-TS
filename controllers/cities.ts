import express from "express";
import citiesModel from "../models/citiesModel";
import { CityModel, FilterData } from "../interfaces";
import { getAllList, getOne } from "./refactorHandler";

const getCitiesList = getAllList<CityModel>(citiesModel, '');
const getCity = getOne<CityModel>(citiesModel);

const filterCities = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    filterData.governorate = req.query.governorate;
    req.filterData = filterData;
    next();
};

export { getCitiesList, getCity, filterCities };