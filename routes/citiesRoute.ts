import { Router } from "express";
import { filterCities, getCitiesList, getCity } from "../controllers/cities";

const citiesRoute: Router = Router();

citiesRoute.route('/').get(filterCities, getCitiesList);
citiesRoute.route("/:id").get(getCity);

export default citiesRoute;