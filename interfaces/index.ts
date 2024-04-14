import mongoose from "mongoose";

// ? @desc models
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
    passwordChangedAt: Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerify: boolean | undefined;
    createdAt: Date;
};

interface CustomerModel extends mongoose.Document {
    name: string;
    address: string;
    phone: string;
    adminUser:mongoose.Schema.Types.ObjectId;
};

interface BillModel extends mongoose.Document {
    customer: mongoose.Schema.Types.ObjectId;
    products: BillProducts[];
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    user: mongoose.Schema.Types.ObjectId;
    adminUser: mongoose.Schema.Types.ObjectId;
};

interface BillProducts {
    product: ProductModel;
    productQuantity: number;
    totalPrice: number;
};

// ? @desc Filter Data
interface FilterData {
    category?: string;
    adminUser?: string | mongoose.Schema.Types.ObjectId;
    user?: string | mongoose.Schema.Types.ObjectId;
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

// ? @desc nodemailer
interface EmailOptions {
    email: string;
    subject: string;
    message: string;
};

interface SendEmailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
};

// ? @desc express interfaces
declare module 'express' {
    interface Request {
        filterData?: FilterData;
        user?: UserModel;
        newToken?: string;
    }
};

export { CategoryModel, ProductModel, CustomerModel, BillModel, UserModel, BillProducts, FilterData, CustomError, QueryString, SearchQuery, PaginationQuery, EmailOptions, SendEmailOptions };