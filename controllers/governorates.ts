import governoratesModel from "../models/governoratesModel";
import { GovernorateModel } from "../interfaces";
import { getAllList, getOne } from "./refactorHandler";

const getGovernoratesWithCities = getAllList<GovernorateModel>(governoratesModel, 'cities');
const getGovernoratesList = getAllList<GovernorateModel>(governoratesModel, '');
const getGovernorate = getOne<GovernorateModel>(governoratesModel, 'governorate', '');

export { getGovernoratesWithCities, getGovernoratesList, getGovernorate };