import express from 'express';
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from '../utils/errors';

export const getAll = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const documents: object = await model.find();
    res.status(200).json({ data: documents });
});

export const createOne = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const document: object = await model.create(req.body);
    res.status(200).json({ data: document });
});

export const getOne = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const document = await model.findById(req.params.id);
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    res.status(200).json({ data: document });
});

export const updateOne = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    res.status(200).json({ data: document });
});

export const deleteOne = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const document = await model.findByIdAndDelete(req.params.id);
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    res.status(204).json({ status: "success" });
});