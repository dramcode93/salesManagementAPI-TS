import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import usersModel from "../models/usersModel";
import { UserModel } from "../interfaces";
import ApiErrors from "../utils/errors";
import { createToken } from "../utils/createToken";

const login = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: UserModel | null = await usersModel.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) { return next(new ApiErrors('Invalid username or password', 401)); };
    const token = createToken(user._id, user.name, user.role, user.createdAt);
    res.status(200).json({ token });
});



export { login };