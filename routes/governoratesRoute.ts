import { Router } from "express";
import { getGovernoratesList, getGovernorate, getGovernoratesWithCities } from "../controllers/governorates";

const governoratesRoute: Router = Router();

governoratesRoute.route('/').get(getGovernoratesWithCities);
governoratesRoute.route('/list').get(getGovernoratesList);
governoratesRoute.route("/:id").get(getGovernorate);

export default governoratesRoute;