import mongoose from "mongoose";

// ? @desc models
interface CategoryModel extends mongoose.Document {
    name: string;
    shop: mongoose.Schema.Types.ObjectId;
};

interface ProductModel extends mongoose.Document {
    name: string;
    quantity: number;
    productPrice: number;
    sellingPrice: number;
    sold: number;
    category: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
};

interface UserModel extends mongoose.Document {
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string[];
    role: 'manager' | 'admin' | 'user' | 'customer';
    active: boolean;
    shop: mongoose.Schema.Types.ObjectId;
    address: Address[];
    passwordChangedAt: Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerify: boolean | undefined;
    createdAt: Date;
};

interface CustomerModel extends mongoose.Document {
    name: string;
    address: Address[];
    phone: string;
    shop: mongoose.Schema.Types.ObjectId;
};

interface Address {
    governorate: GovernorateModel;
    city: CityModel;
    street: string;
};

interface BillModel extends mongoose.Document {
    customer: mongoose.Schema.Types.ObjectId;
    products: BillProducts[];
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    user: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
};

interface BillProducts {
    product: ProductModel;
    productQuantity: number;
    totalPrice: number;
};

interface ShopModel extends mongoose.Document {
    name: string;
    type: ShopTypeModel;
    address: Address[];
};

interface ShopTypeModel extends mongoose.Document {
    type: string;
};

interface GovernorateModel extends mongoose.Document {
    governorate_name_ar: string;
    governorate_name_en: string;
};

interface CityModel extends mongoose.Document {
    governorate: mongoose.Schema.Types.ObjectId;
    city_name_ar: string;
    city_name_en: string;
};

// ? @desc Filter Data
interface FilterData {
    category?: string;
    shop?: string | mongoose.Schema.Types.ObjectId;
    user?: string | mongoose.Schema.Types.ObjectId;
    role?: string;
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

export { CategoryModel, ProductModel, UserModel, CustomerModel, BillModel, BillProducts, ShopModel, ShopTypeModel, GovernorateModel, Address, CityModel, FilterData, CustomError, QueryString, SearchQuery, PaginationQuery, EmailOptions, SendEmailOptions };