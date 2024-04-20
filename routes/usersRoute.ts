import { Router } from "express";
import { getLoggedUserData, createUser, filterUsers, getUser, getUsers, updateUser, updateLoggedUserPassword, updateLoggedUser, changeUserPassword, changeUserActivation, addUserPhone, addUserAddress, deleteUserPhone, deleteUserAddress, addLoggedUserPhone, addLoggedUserAddress, deleteLoggedUserPhone, deleteLoggedUserAddress } from "../controllers/users";
import { LoggedUserAddressValidator, LoggedUserPhoneValidator, UserAddressValidator, UserPhoneValidator, changeUserPasswordValidator, createUserValidator, getUserValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator, updateUserValidator, userActiveValidator } from "../utils/validation/usersValidator";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth";

const usersRoute: Router = Router();
usersRoute.use(protectRoutes, checkActive);

usersRoute.get('/getMe', getLoggedUserData, getUserValidator, getUser);
usersRoute.put('/updateMyPassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword);

usersRoute.put('/updateMe', allowedTo('manager', 'admin', 'customer'), updateLoggedUserValidator, updateLoggedUser);

usersRoute.put('/addPhone', allowedTo('manager', 'admin', 'customer'), LoggedUserPhoneValidator, addLoggedUserPhone);
usersRoute.put('/addAddress', allowedTo('manager', 'admin', 'customer'), LoggedUserAddressValidator, addLoggedUserAddress);
usersRoute.delete('/deletePhone', allowedTo('manager', 'admin', 'customer'), LoggedUserPhoneValidator, deleteLoggedUserPhone);
usersRoute.delete('/deleteAddress', allowedTo('manager', 'admin', 'customer'), LoggedUserAddressValidator, deleteLoggedUserAddress);

usersRoute.use(allowedTo('manager', 'admin'));

usersRoute.route('/')
    .get(filterUsers, getUsers)
    .post(createUserValidator, createUser);

usersRoute.route("/:id")
    .get(getUserValidator, getUser)
    .put(updateUserValidator, updateUser);

usersRoute.put('/:id/addPhone', UserPhoneValidator, addUserPhone);
usersRoute.put('/:id/addAddress', UserAddressValidator, addUserAddress);
usersRoute.put('/:id/activeUser', userActiveValidator, changeUserActivation);
usersRoute.put('/:id/changeUserPassword', changeUserPasswordValidator, changeUserPassword);

usersRoute.delete('/:id/deletePhone', UserPhoneValidator, deleteUserPhone);
usersRoute.delete('/:id/deleteAddress', UserAddressValidator, deleteUserAddress);

export default usersRoute;