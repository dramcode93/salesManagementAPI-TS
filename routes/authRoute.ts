import { Router } from "express";
import { checkUsername, forgetPassword, login, protectRoutes, refreshToken, resetPassword, signup, verifyResetPasswordCode } from "../controllers/auth";
import { loginValidator, resetPasswordValidator, signupValidator } from "../utils/validation/authValidator";

const authRoute: Router = Router();

authRoute.route('/checkUsername').post(checkUsername);
authRoute.route('/signup').post(signupValidator, signup);
authRoute.route('/login').post(loginValidator, login);
authRoute.route('/forgetPassword').post(forgetPassword);
authRoute.route('/verifyResetPasswordCode').post(verifyResetPasswordCode);
authRoute.route('/resetPassword').put(resetPasswordValidator, resetPassword);
authRoute.route('/refreshToken').get(protectRoutes, refreshToken);

export default authRoute;