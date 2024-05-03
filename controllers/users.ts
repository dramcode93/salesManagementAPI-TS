import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import usersModel from '../models/usersModel';
import { FilterData, UserModel } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";
import { createToken } from '../utils/createToken';
import { sanitizeUser } from '../utils/sanitization';
import ApiErrors from '../utils/errors';

const getUsers = getAll<UserModel>(usersModel, 'users');
const getUser = getOne<UserModel>(usersModel, 'users', '');

const createUser = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | undefined = req.user;
    if (user?.role === 'admin') { req.body.role = 'user'; req.body.shop = req.user?.shop; await usersModel.create(req.body); } else { await usersModel.create(req.body); };
    res.status(200).json({ message: 'new user created successfully' });
});

const updateUser = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { name: req.body.name, email: req.body.email }, { new: true });
    res.status(200).json({ message: 'user updated successfully' });
});

const addUserPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { $addToSet: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'user phone added successfully' });
});

const addUserAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { $addToSet: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'user address added successfully' });
});

const deleteUserPhone = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { $pull: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'user phone deleted successfully' });
});

const deleteUserAddress = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { $pull: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'user address deleted successfully' });
});

const changeUserActivation = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (user.role === 'manager' || user._id.toString() === req.user?._id.toString()) { return next(new ApiErrors('You can not update activation', 400)); };
    if (req.user?.role === 'admin' && (req.user.shop.toString() !== user.shop.toString())) { return next(new ApiErrors('you can update your users only', 400)); };
    if (req.user?.role === 'manager' && user.role === 'admin') {
        const shopUsers: UserModel[] = await usersModel.find({ shop: user.shop });
        if (shopUsers) { const updateUsers = shopUsers.map(async (user: UserModel): Promise<void> => { await usersModel.findByIdAndUpdate(user._id, { active: req.body.active }, { new: true }); }); await Promise.all(updateUsers); };
    };
    await usersModel.findByIdAndUpdate(user._id, { active: req.body.active }, { new: true });
    res.status(200).json({ message: 'user updated successfully' });
});

const changeUserPassword = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors(`No user for this id ${req.params.id}`, 404)); }
    if (req.user?.role === 'admin' && ((req.user.shop).toString() !== (user.shop).toString())) { return next(new ApiErrors("you can update your users only", 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not change manager password', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { password: await bcrypt.hash(req.body.password, 13), passwordChangedAt: Date.now() }, { new: true });
    res.status(200).json({ message: 'user password updated successfully' });
});

const filterUsers = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    if (req.user?.role === 'admin') { filterData.shop = req.user.shop; filterData.role = "user"; }
    else if (req.user?.role === 'manager') { filterData.role = ['manager', 'admin']; };
    req.filterData = filterData;
    next();
};

const getLoggedUserData = expressAsyncHandler((req: express.Request, res: express.Response, next: express.NextFunction): void => { req.params.id = req.user?._id; next(); });

const updateLoggedUser = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user!._id, { name: req.body.name, email: req.body.email }, { new: true });
    const token: string = createToken(user!._id, user!.name, user!.role, user!.createdAt);
    res.status(200).json({ message: 'your data updated successfully', token, user: sanitizeUser(user) });
});

const addLoggedUserPhone = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user!._id, { $addToSet: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'your phone number added successfully', user: sanitizeUser(user) });
});

const addLoggedUserAddress = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user = await usersModel.findByIdAndUpdate(req.user!._id, { $addToSet: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'your address added successfully', user: sanitizeUser(user) });
});

const deleteLoggedUserPhone = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user = await usersModel.findByIdAndUpdate(req.user!._id, { $pull: { phone: req.body.phone } }, { new: true });
    res.status(200).json({ message: 'your phone number deleted successfully', user: sanitizeUser(user) });
});

const deleteLoggedUserAddress = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user = await usersModel.findByIdAndUpdate(req.user!._id, { $pull: { address: req.body.address } }, { new: true });
    res.status(200).json({ message: 'your address deleted successfully', user: sanitizeUser(user) });
});

const updateLoggedUserPassword = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user!._id, { password: await bcrypt.hash(req.body.password, 13), passwordChangedAt: Date.now() }, { new: true });
    const token: string = createToken(user!._id, user!.name, user!.role, user!.createdAt);
    res.status(200).json({ message: 'your password updated successfully', token });
});

export { getUsers, createUser, getUser, updateUser, addUserPhone, addUserAddress, deleteUserPhone, deleteUserAddress, changeUserActivation, changeUserPassword, getLoggedUserData, updateLoggedUser, updateLoggedUserPassword, addLoggedUserAddress, addLoggedUserPhone, deleteLoggedUserPhone, deleteLoggedUserAddress, filterUsers };