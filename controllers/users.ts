import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import usersModel from '../models/usersModel';
import { FilterData, UserModel } from "../interfaces";
import { getAll, getOne } from "./refactorHandler";
import { createToken } from '../utils/createToken';
import ApiErrors from '../utils/errors';

const getUsers = getAll<UserModel>(usersModel, 'users');
const getUser = getOne<UserModel>(usersModel);

const createUser = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | undefined = req.user;
    if (user?.role === 'admin') {
        req.body.role = 'user';
        req.body.adminUser = user._id;
        const createdUser: UserModel = await usersModel.create(req.body);
        await usersModel.findByIdAndUpdate(user._id, { $addToSet: { users: createdUser._id } }, { new: true });
    } else { await usersModel.create(req.body) };
    res.status(200).json({ message: 'new user created successfully' });
});

const updateUser = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (req.user?.role === 'admin' && ((req.user._id).toString() !== (user.adminUser).toString())) { return next(new ApiErrors('you can update your users only', 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not update manager data', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { name: req.body.name, email: req.body.email }, { new: true });
    res.status(200).json({ message: 'user updated successfully' });
});

const changeUserActivation = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors('no user for this Id', 404)); };
    if (user.role === 'manager') { return next(new ApiErrors('You can not update manager activation', 400)); };
    if (req.user?.role === 'manager' && user.role === 'admin') {
        const adminUsers: UserModel[] = await usersModel.find({ adminUser: user._id });
        if (adminUsers) { const updateUsers = adminUsers.map(async (user) => { await usersModel.findByIdAndUpdate(user._id, { active: req.body.active }, { new: true }); }); await Promise.all(updateUsers); };
    };
    await usersModel.findByIdAndUpdate(user._id, { active: req.body.active }, { new: true });
    res.status(200).json({ message: 'user updated successfully' });
});

const changeUserPassword = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findById(req.params.id);
    if (!user) { return next(new ApiErrors(`No user for this id ${req.params.id}`, 404)); }
    if (req.user?.role === 'admin' && ((req.user._id).toString() !== (user.adminUser).toString())) { return next(new ApiErrors("you can update your users only", 400)); }
    else if (user.role === 'manager') { return next(new ApiErrors('You can not change manager password', 400)); };
    await usersModel.findByIdAndUpdate(user._id, { password: await bcrypt.hash(req.body.password, 13), passwordChangedAt: Date.now() }, { new: true });
    res.status(200).json({ message: 'user password updated successfully' });
});

const filterUsers = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let filterData: FilterData = {};
    if (req.user?.role === 'admin') { filterData.adminUser = req.user._id };
    req.filterData = filterData;
    next();
};

const getLoggedUserData = expressAsyncHandler((req: express.Request, res: express.Response, next: express.NextFunction): void => { req.params.id = req.user?._id; next(); });

const updateLoggedUser = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user!._id, {
        name: req.body.name,
        email: req.body.email
    }, { new: true });
    const token: string = createToken(user!._id, user!.name, user!.role, user!.createdAt);
    res.status(200).json({ message: 'your data updated successfully', token })
});

const updateLoggedUserPassword = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    const user: UserModel | null = await usersModel.findByIdAndUpdate(req.user!._id, {
        password: await bcrypt.hash(req.body.password, 13),
        passwordChangedAt: Date.now()
    }, { new: true });
    const token: string = createToken(user!._id, user!.name, user!.role, user!.createdAt);
    res.status(200).json({ message: 'your password updated successfully', token })
});

export { getUsers, createUser, getUser, updateUser, changeUserActivation, changeUserPassword, getLoggedUserData, updateLoggedUser, updateLoggedUserPassword, filterUsers };