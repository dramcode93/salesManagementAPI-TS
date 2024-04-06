import { Router } from "express";
import { getLoggedUserData, createUser, filterUsers, getUser, getUsers, updateUser, updateLoggedUserPassword, updateLoggedUser, changeUserPassword, changeUserActivation } from "../controllers/users";
import { changeUserPasswordValidator, createUserValidator, getUserValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator, updateUserValidator, userActiveValidator } from "../utils/validation/usersValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const usersRoute: Router = Router();
usersRoute.use(protectRoutes, checkActive);

usersRoute.get('/getMe', getLoggedUserData, getUserValidator, getUser);
usersRoute.put('/updateMyPassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword);

usersRoute.use(allowedTo('manager', 'admin'));

usersRoute.route('/')
    .get(filterUsers, getUsers)
    .post(createUserValidator, createUser);

usersRoute.put('/updateMe', updateLoggedUserValidator, updateLoggedUser);

usersRoute.route("/:id")
    .get(getUserValidator, getUser)
    .put(updateUserValidator, updateUser);

usersRoute.put('/:id/activeUser', userActiveValidator, changeUserActivation);
usersRoute.put('/:id/changeUserPassword', changeUserPasswordValidator, changeUserPassword);

export default usersRoute;