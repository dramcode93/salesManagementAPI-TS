import mongoose from "mongoose";

//  *@desc models
interface CategoryModel extends mongoose.Document {
    name: string;
    adminUser: mongoose.Schema.Types.ObjectId;
}

interface ProductModel extends mongoose.Document {
    name: string;
    quantity: number;
    productPrice: number;
    sellingPrice: number;
    sold: number;
    category: mongoose.Schema.Types.ObjectId;
    adminUser: mongoose.Schema.Types.ObjectId;
}

// * @desc Global Errors Interfaces
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
};

// * @desc Api Features Interfaces
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

export { CategoryModel, ProductModel, CustomError, QueryString, SearchQuery, PaginationQuery }