import { Router } from "express";
import { login } from "../controllers/auth";
import { loginValidator, resetPasswordValidator } from "../utils/validation/authValidator";

const authRoute: Router = Router();

authRoute.route('/login').post(loginValidator, login);
// authRoute.route('/forgetPassword').post(forgetPassword);
// authRoute.route('/verifyResetPasswordCode').post(verifyResetPasswordCode);
// authRoute.route('/resetPassword').put(resetPasswordValidator, resetPassword);
// authRoute.route('/refreshToken').get(protectRoutes, refreshToken);

export default authRoute;