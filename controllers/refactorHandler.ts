import express from 'express';
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from '../utils/errors';
import ApiFeatures from '../utils/ApiFeatures';

export const getAll = (model: mongoose.Model<any>, modelName: string) => expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    let searchLength: number = 0;
    if (req.query.search) {
        const searchResult: ApiFeatures = new ApiFeatures(model.find(), req.query).search(modelName);
        const searchData: {}[] = await searchResult.mongooseQuery;
        searchLength = searchData.length;
    };
    const documentCount: number = searchLength || await model.find().countDocuments();
    const apiFeatures: ApiFeatures = new ApiFeatures(model.find(), req.query).filter().sort().limitFields().search(modelName).pagination(documentCount);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents: {}[] = await mongooseQuery;
    res.status(200).json({ results: documents.length, paginationResult, data: documents });
});

export const getAllList = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const apiFeatures: ApiFeatures = new ApiFeatures(model.find(), req.query).sort();
    const { mongooseQuery } = apiFeatures;
    const documents: {}[] = await mongooseQuery;
    res.status(200).json({ results: documents.length, data: documents })
});

export const createOne = (model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response) => {
    const document: {} = await model.create(req.body);
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