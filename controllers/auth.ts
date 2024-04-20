import express from "express";
import expressAsyncHandler from "express-async-handler";
import Jwt from 'jsonwebtoken';
import crypto from "crypto";
import bcrypt from "bcryptjs";
import usersModel from "../models/usersModel";
import sendEmail from "../utils/sendEmail";
import ApiErrors from "../utils/errors";
import { createResetToken, createToken } from "../utils/createToken";
import { UserModel } from "../interfaces";

const signup = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    req.body.role = 'customer';
    const user: UserModel = await usersModel.create(req.body);
    const token: string = createToken(user._id, user.name, user.role, user.createdAt);
    res.status(201).json({ token });
});

const login = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) { return next(new ApiErrors('Invalid username or password', 401)); };
    const token: string = createToken(user._id, user.name, user.role, user.createdAt);
    res.status(200).json({ token });
});

const forgetPassword = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const user: UserModel | null = await usersModel.findOne({ email: req.body.email }); // * Get the user by email
    if (!user) { return next(new ApiErrors('no account with this email exist', 400)); };
    const resetCode: string = Math.floor(100000 + Math.random() * 900000).toString(); // * Create a random reset code from 6 numbers
    const hashedResetCode: string = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.passwordResetCode = hashedResetCode; // * set the hashed reset code in user DB
    user.passwordResetCodeExpires = Date.now() + (10 * 60 * 1000); // * set expire time for reset code
    user.passwordResetCodeVerify = false;
    const message: string = `رمز التحقق الخاص بك هو ${resetCode}`;
    try {
        await sendEmail({ email: user.email, subject: 'إعادة تعيين كلمة المرور', message }); // * Send the reset code to email
        await user.save({ validateModifiedOnly: true }); // * Save the updated Data
    } catch (err: any) { console.log(err); return next(new ApiErrors('Error while sending a password reset code... try again later', 400)); };
    const resetToken: string = createResetToken(user._id);
    res.status(200).json({ msg: 'check your email', resetToken });
});

const verifyResetPasswordCode = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let resetToken: string = '';
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { resetToken = req.headers.authorization.split(' ')[1] };
    if (resetToken === '') { return next(new ApiErrors("you don't have permission to verify reset code", 400)); };
    const decodedToken: any = Jwt.verify(resetToken, process.env.JWT_RESET_SECRET_KEY!);
    const hashedResetCode: string = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user: UserModel | null = await usersModel.findOne({ _id: decodedToken._id, passwordResetCode: hashedResetCode, passwordResetCodeExpires: { $gt: Date.now() } });
    if (!user) { return next(new ApiErrors('Invalid or expired reset code', 400)) };
    user.passwordResetCodeVerify = true;
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({ success: true });
});

const resetPassword = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let resetToken: string = '';
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { resetToken = req.headers.authorization.split(' ')[1]; };
    if (resetToken === '') { return next(new ApiErrors('You do not have permission to verify reset code.', 400)); };
    const decodedToken: any = Jwt.verify(resetToken, process.env.JWT_RESET_SECRET_KEY!);
    const user: UserModel | null = await usersModel.findOne({ _id: decodedToken._id, passwordResetCodeVerify: true });
    if (!user) { return next(new ApiErrors('Please verify your code first', 400)); };
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({ success: true, data: "Password has been changed" });
});

const protectRoutes = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let token: string = ''; // * Check token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { token = req.headers.authorization.split(' ')[1]; };
    if (token === '') { return next(new ApiErrors('You are not logged in! Please log in to get access.', 401)); };
    const decoded: any = Jwt.verify(token, process.env.JWT_SECRET_KEY!); // * Verify token
    const expirationThreshold: number = 24 * 60 * 60; // * Check if token is about to expire within the next 24 hours
    if (decoded.exp - Date.now() / 1000 < expirationThreshold) {
        try {
            const newToken: string = createToken(decoded._id, decoded.name, decoded.role, decoded.createdAt); // * Generate a new token (refresh token logic)
            req.newToken = newToken;
        } catch (error: any) {
            console.error('Error generating new token:', error);
            return next(new ApiErrors('Failed to refresh token.', 500));
        };
    };
    const user: UserModel | null = await usersModel.findById(decoded._id); // * Check if user exist
    if (!user) { return next(new ApiErrors('The user does not exist anymore...', 404)); };
    if (user.passwordChangedAt instanceof Date) { // * Check if user change his password
        const changedPasswordTime: number = (user.passwordChangedAt.getTime() / 1000);
        if (changedPasswordTime > decoded.iat) { return next(new ApiErrors('Your password has been updated since you logged in last time. Please log in again.', 403)); };
    };
    req.user = user; // * Attach the user to the request object
    next();
});

const refreshToken = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    let newToken: string = '';
    if (req.newToken) { newToken = req.newToken }
    console.log(`Token Refreshed to user ${req.user?.name}`);
    res.json({ token: newToken })
});

const allowedTo = (...roles: string[]) =>
    expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        if (!(roles.includes(req.user?.role ?? ''))) { return next(new ApiErrors(`Provilege denied! You cannot perform this action`, 403)); };
        next();
    });

const checkActive = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (!req.user?.active) { return next(new ApiErrors("Your account is deactivated", 403)); };
    next();
});

export { signup, login, forgetPassword, verifyResetPasswordCode, resetPassword, protectRoutes, allowedTo, checkActive, refreshToken };