import express from 'express';
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from '../utils/errors';
import ApiFeatures from '../utils/ApiFeatures';
import { FilterData } from '../interfaces';
import { sanitizeShop, sanitizeUser } from '../utils/sanitization';

export const getAll = <modelType>(model: mongoose.Model<any>, modelName: string) => expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    let filterData: FilterData = {};
    let searchLength: number = 0;
    if (req.filterData) {
        filterData = req.filterData;
        const data: modelType[] = await model.find(filterData);
        searchLength = data.length;
    };
    if (req.query.search) {
        const searchResult: ApiFeatures = new ApiFeatures(model.find(filterData), req.query).search(modelName);
        const searchData: modelType[] = await searchResult.mongooseQuery;
        searchLength = searchData.length;
    };
    const documentCount: number = searchLength || await model.find(filterData).countDocuments();
    const apiFeatures: ApiFeatures = new ApiFeatures(model.find(filterData), req.query).filter().sort().limitFields().search(modelName).pagination(documentCount);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents: modelType[] = await mongooseQuery;
    if (modelName === 'users') {
        const sanitizedUsers = documents.map(user => sanitizeUser(user));
        res.status(200).json({ results: documents.length, paginationResult, data: sanitizedUsers });
    }
    else if (modelName === 'shops') {
        const sanitizedShops = documents.map(shop => sanitizeShop(shop));
        res.status(200).json({ results: documents.length, paginationResult, data: sanitizedShops });
    }
    else { res.status(200).json({ results: documents.length, paginationResult, data: documents }); };
});

export const getAllList = <modelType>(model: mongoose.Model<any>, population: string) => expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    let filterData: FilterData = {};
    let apiFeatures: ApiFeatures;
    if (req.filterData) { filterData = req.filterData; };
    if (population !== '') { apiFeatures = new ApiFeatures(model.find(filterData).populate(population), req.query).sort().limitFields(); }
    else { apiFeatures = new ApiFeatures(model.find(filterData), req.query).sort().limitFields(); };
    const { mongooseQuery } = apiFeatures;
    const documents: modelType[] = await mongooseQuery;
    res.status(200).json({ results: documents.length, data: documents });
});

export const createOne = <modelType>(model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
    req.body.shop = req.user?.shop;
    const document: modelType = await model.create(req.body);
    res.status(200).json({ data: document });
});

export const getOne = <modelType>(model: mongoose.Model<any>, modelName: string, population: string) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // const document: modelType | null = await model.findById(req.params.id);
    // if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    let apiFeatures: ApiFeatures;
    if (population !== '') { apiFeatures = new ApiFeatures(model.findById(req.params.id).populate(population), req.query).limitFields(); }
    else { apiFeatures = new ApiFeatures(model.findById(req.params.id), req.query).limitFields(); };
    const { mongooseQuery } = apiFeatures;
    const document: modelType[] = await mongooseQuery;
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    if (modelName === "users") { res.status(200).json({ data: sanitizeUser(document) }); }
    else if (modelName === "shops") { res.status(200).json({ data: sanitizeShop(document) }); }
    else { res.status(200).json({ data: document }); };
});

export const updateOne = <modelType>(model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const document: modelType | null = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    res.status(200).json({ data: document });
});

export const deleteOne = <modelType>(model: mongoose.Model<any>) => expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const document: modelType | null = await model.findByIdAndDelete(req.params.id);
    if (!document) { return next(new ApiErrors(`No document for this id`, 404)); };
    res.status(204).json({ status: "success" });
});