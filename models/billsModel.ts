import mongoose from "mongoose";
import dailySalesModel from "./dailySalesModel";
import monthlySalesModel from "./monthlySalesModel";
import yearlySalesModel from "./yearlySalesModel";
import { BillModel, SalesModel, SubSalesModel } from "../interfaces";
import shopsModel from "./shopsModel";
import dailySubSalesModel from "./dailySubSalesModel";
import monthlySubSalesModel from "./monthlySubSalesModel";
import yearlySubSalesModel from "./yearlySubSalesModel";
import subShopsModel from "./subShopsModel";

const billSchema: mongoose.Schema = new mongoose.Schema<BillModel>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, 'customer id is required'],
    },
    customerName: { type: String, },
    code: { type: String, },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: [true, 'product id is required']
        },
        productQuantity: { type: Number },
        totalPrice: { type: Number }
    }],
    discount: { type: Number, default: 0 },
    totalAmountBeforeDiscount: { type: Number },
    totalAmountAfterDiscount: { type: Number },
    paidAmount: { type: Number, required: [true, 'paid Amount is required'] },
    remainingAmount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    subShop: { type: mongoose.Schema.Types.ObjectId, ref: "subShops" },
}, { timestamps: true });

billSchema.pre<BillModel>('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError): Promise<void> {
    const date: Date = new Date();
    await this.populate({ path: 'products.product', select: 'sellingPrice productPrice' });
    const products = this.products;
    let totalSellingPrice: number = 0;
    let totalProductPrice: number = 0;
    for (const item of products) {
        const totalPrice: number = item.product.sellingPrice * item.productQuantity;
        const productPrice: number = item.product.productPrice * item.productQuantity;
        item.totalPrice = totalPrice;
        totalSellingPrice += totalPrice;
        totalProductPrice += productPrice;
    };
    this.totalAmountBeforeDiscount = totalSellingPrice;
    if (this.discount !== 0) { this.totalAmountAfterDiscount = this.totalAmountBeforeDiscount - (this.discount / 100) * this.totalAmountBeforeDiscount; }
    else { this.totalAmountAfterDiscount = this.totalAmountBeforeDiscount; };
    this.remainingAmount = this.totalAmountAfterDiscount - this.paidAmount;

    // * Daily
    // ? Sales
    const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));
    const dailySales: SalesModel | null = await dailySalesModel.findOne({ shop: this.shop, createdAt: { $gte: startOfDay, $lt: endOfDay } });
    if (!dailySales) { await dailySalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        dailySales.sales += this.paidAmount;
        dailySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        dailySales.save();
    };

    // ? Sub Sales
    const dailySubSales: SubSalesModel | null = await dailySubSalesModel.findOne({ shop: this.shop, subShop: this.subShop, createdAt: { $gte: startOfDay, $lt: endOfDay } });
    if (!dailySubSales) { await dailySubSalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop, subShop: this.subShop }); }
    else {
        dailySubSales.sales += this.paidAmount;
        dailySubSales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        dailySubSales.save();
    };

    // * Monthly
    // ? Sales
    const monthlySales: SalesModel | null = await monthlySalesModel.findOne({ shop: this.shop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } });
    if (!monthlySales) { await monthlySalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        monthlySales.sales += this.paidAmount;
        monthlySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        monthlySales.save();
    };

    // ? Sub Sales
    const monthlySubSales: SubSalesModel | null = await monthlySubSalesModel.findOne({ shop: this.shop, subShop: this.subShop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } });
    if (!monthlySubSales) { await monthlySubSalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop, subShop: this.subShop }); }
    else {
        monthlySubSales.sales += this.paidAmount;
        monthlySubSales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        monthlySubSales.save();
    };

    // * Yearly
    // ? Sales
    const yearlySales: SalesModel | null = await yearlySalesModel.findOne({ shop: this.shop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } });
    if (!yearlySales) { await yearlySalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        yearlySales.sales += this.paidAmount;
        yearlySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        yearlySales.save();
    };

    // ? Sub Sales
    const yearlySubSales: SubSalesModel | null = await yearlySubSalesModel.findOne({ shop: this.shop, subShop: this.subShop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } });
    if (!yearlySubSales) { await yearlySubSalesModel.create({ sales: this.paidAmount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop, subShop: this.subShop }); }
    else {
        yearlySubSales.sales += this.paidAmount;
        yearlySubSales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        yearlySubSales.save();
    };

    // * update shop & sub shop products money
    await shopsModel.findByIdAndUpdate(this.shop, { $inc: { allMoney: this.totalAmountAfterDiscount, productsMoney: -totalProductPrice } }, { new: true });
    await subShopsModel.findByIdAndUpdate(this.subShop, { $inc: { allMoney: this.totalAmountAfterDiscount, productsMoney: -totalProductPrice } }, { new: true });
    next();
});

billSchema.pre<BillModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'products.product', select: 'name sellingPrice' });
    this.populate({ path: 'user', select: '_id name' });
    this.populate({ path: 'customer', select: '_id name phone' });
    this.populate({ path: 'subShop', select: '_id name' });
    next();
});

export default mongoose.model<BillModel>("bills", billSchema);