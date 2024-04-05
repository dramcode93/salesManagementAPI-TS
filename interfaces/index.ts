import mongoose from "mongoose";

//  ? @desc models
interface CategoryModel extends mongoose.Document {
    name: string;
    adminUser: mongoose.Schema.Types.ObjectId;
};

interface ProductModel extends mongoose.Document {
    name: string;
    quantity: number;
    productPrice: number;
    sellingPrice: number;
    sold: number;
    category: mongoose.Schema.Types.ObjectId;
    adminUser: mongoose.Schema.Types.ObjectId;
};

interface UserModel extends mongoose.Document {
    username: string;
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'admin' | 'user';
    active: boolean;
    users: mongoose.Schema.Types.ObjectId[];
    adminUser: mongoose.Schema.Types.ObjectId;
    passwordChangedAt: Date;
    passwordResetCode: string;
    passwordResetCodeExpires: Date;
    passwordResetCodeVerify: boolean;
    createdAt: Date;
};

// ? @desc Filter Data
interface FilterData {
    category?: string;
    adminUser?: string | mongoose.Schema.Types.ObjectId;
};

// ? @desc Global Errors Interfaces
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
};

// ? @desc Api Features Interfaces
interface QueryString {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: string;
    search?: string;
    [key: string]: any; // Index signature to allow additional properties
};

interface SearchQuery {
    $or?: {}[];
    customerName?: RegExp;
    name?: RegExp;
    role?: RegExp;
}

interface PaginationQuery {
    currentPge?: number;
    limit?: number;
    numberOfPages?: number;
    next?: number;
    prev?: number;
};

//  ? @desc express interfaces
declare module 'express' {
    interface Request {
        filterData?: FilterData;
        user?: UserModel;
    }
};

export { CategoryModel, ProductModel, UserModel, FilterData, CustomError, QueryString, SearchQuery, PaginationQuery }