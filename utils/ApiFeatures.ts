import mongoose from "mongoose";
import { QueryString, SearchQuery, PaginationQuery } from "../interfaces";

class ApiFeatures {
    public paginationResult: PaginationQuery = {};
    constructor(public mongooseQuery: mongoose.Query<any[], any>, private queryString: QueryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    };

    filter() {
        const queryStringObj: QueryString = { ...this.queryString };
        const executedFields: string[] = ["page", "limit", "sort", "fields", "search"];
        executedFields.forEach((field: string) => { delete queryStringObj[field] });
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    };

    sort() {
        if (this.queryString.sort) {
            const sortBy: string = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else { this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); };
        return this;
    };

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else { this.mongooseQuery = this.mongooseQuery.select("-__v"); };
        return this;
    };

    search(modelName: string) {
        if (this.queryString.search) {
            let query: SearchQuery = {};
            if (modelName === "bills") { query = { customer: new RegExp(this.queryString.search, "i") }; }
            else if (modelName === 'users') {
                query.$or = [
                    { name: new RegExp(this.queryString.search, "i") },
                    { role: new RegExp(this.queryString.search, "i") },
                ];
            }
            else { query = { name: new RegExp(this.queryString.search, "i") }; };
            this.mongooseQuery = this.mongooseQuery.find(query);
        };
        return this;
    };

    pagination(countDocument: number) {
        const page: number = this.queryString.page || 1;
        const limit: number = this.queryString.limit || 20;
        const skip: number = (page - 1) * limit;
        const endIndex: number = page * limit;
        const pagination: PaginationQuery = {};
        pagination.currentPge = Number(page);
        pagination.limit = Number(limit);
        pagination.numberOfPages = Math.ceil(countDocument / limit);
        if (endIndex < countDocument) { pagination.next = Number(page) + 1; };
        if (skip > 0) { pagination.prev = Number(page) - 1; };
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    };
};

export default ApiFeatures;