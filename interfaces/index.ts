import mongoose from "mongoose";

// ? @desc models
interface CategoryModel extends mongoose.Document {
    name: string;
    shop: mongoose.Schema.Types.ObjectId;
};
interface CouponModel extends mongoose.Document {
    name: string;
    expire: Date;
    discount: number;
    shop: mongoose.Schema.Types.ObjectId;
};
interface CartModel extends mongoose.Document {
    cartItems: BillProducts[];
    totalCartPrice: number;
    totalPriceAfterDiscount: number;
    user: mongoose.Schema.Types.ObjectId;
    coupon: mongoose.Schema.Types.ObjectId;
};
interface ProductModel extends mongoose.Document {
    name: string;
    description: string;
    quantity: number;
    productPrice: number;
    sellingPrice: number;
    sold: number;
    receivedQuantity: number;
    badQuantity: number;
    images: string[];
    category: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
    subShops: SubShopProducts[];
};
interface SubShopProducts {
    subShop: mongoose.Schema.Types.ObjectId;
    quantity: number;
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
    subShop: mongoose.Schema.Types.ObjectId;
    address: Address[];
    passwordChangedAt: Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerify: boolean | undefined;
    createdAt: Date;
};

interface CompanyModel extends mongoose.Document {
    name: string;
    phone: string;
    address: Address;
    shop: mongoose.Schema.Types.ObjectId;
};

interface CustomerModel extends mongoose.Document {
    name: string;
    address: Address[];
    phone: string[];
    shop: mongoose.Schema.Types.ObjectId;
};

interface Address {
    governorate: GovernorateModel;
    city: CityModel;
    street: string;
};

interface BillModel extends mongoose.Document {
    customer: mongoose.Schema.Types.ObjectId;
    customerName: string;
    code: string;
    products: BillProducts[];
    discount: number;
    totalAmountBeforeDiscount: number;
    totalAmountAfterDiscount: number;
    paidAmount: number;
    remainingAmount: number;
    user: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
    subShop: mongoose.Schema.Types.ObjectId;
};

interface BillProducts {
    product: ProductModel;
    productQuantity: number;
    totalPrice: number;
};
interface OrderModel extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    shop: mongoose.Schema.Types.ObjectId;
    subShop: mongoose.Schema.Types.ObjectId;
    cartItems: BillProducts[];
    totalOrderPrice: number;
    paymentMethodType: 'cash' | 'online';
    receivingMethod: 'delivery' | 'shop';
    isPaid: Boolean;
    paidAt: Date | number;
    isDelivered: Boolean;
    deliveredAt: Date | number;
};

interface ShopModel extends mongoose.Document {
    name: string;
    type: ShopTypeModel[];
    image: string;
    allMoney: number;
    productsMoney: number;
    debts: number;
};
interface SubShopModel extends mongoose.Document {
    name: string;
    address: Address;
    phone: string[];
    allMoney: number;
    productsMoney: number;
    debts: number;
    shippingPriceInside: number;
    shippingPriceOutside: number;
    deliveryService: boolean;
    onlinePaymentMethods: OnlinePaymentMethods[];
    active: boolean;
    shop: mongoose.Schema.Types.ObjectId;
};

interface OnlinePaymentMethods {
    name: string;
    account: string;
}

interface FinancialTransactionsModel extends mongoose.Document {
    money: number;
    reason: string;
    transaction: "withdraw" | "deposit";
    shop: mongoose.Schema.Types.ObjectId;
    subShop: mongoose.Schema.Types.ObjectId;
};

interface SalesModel extends mongoose.Document {
    sales: number;
    earnings: number;
    createdAt: Date;
    shop: mongoose.Schema.Types.ObjectId;
};

interface SubSalesModel extends mongoose.Document {
    sales: number;
    earnings: number;
    createdAt: Date;
    shop: mongoose.Schema.Types.ObjectId;
    subShop: mongoose.Schema.Types.ObjectId;
};

interface ShopTypeModel extends mongoose.Document {
    type_ar: string;
    type_en: string;
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
    subShop?: any;
    user?: string | mongoose.Schema.Types.ObjectId;
    role?: any;
    governorate?: any;
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
    $or?: Array<{ [key: string]: RegExp }>;
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
        files?: any;
    }
};

export { CategoryModel, CouponModel, CartModel, ProductModel, UserModel, CustomerModel, CompanyModel, BillModel, BillProducts, OrderModel, ShopModel, SubShopModel, ShopTypeModel, FinancialTransactionsModel, SalesModel, SubSalesModel, GovernorateModel, Address, CityModel, FilterData, CustomError, QueryString, SearchQuery, PaginationQuery, EmailOptions, SendEmailOptions };