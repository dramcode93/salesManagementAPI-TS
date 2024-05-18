import mongoose from "mongoose";
import dailySalesModel from "./dailySalesModel";
import monthlySalesModel from "./monthlySalesModel";
import yearlySalesModel from "./yearlySalesModel";
import { BillModel, SalesModel } from "../interfaces";

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
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" }
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

    // * daily sales
    const startOfDay: Date = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(date.setHours(23, 59, 59, 999));
    const dailySales: SalesModel | null = await dailySalesModel.findOne({ shop: this.shop, createdAt: { $gte: startOfDay, $lt: endOfDay } });
    if (!dailySales) { await dailySalesModel.create({ sales: this.totalAmountAfterDiscount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        dailySales.sales += this.totalAmountAfterDiscount;
        dailySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        dailySales.save();
    };

    // * monthly sales
    const monthlySales: SalesModel | null = await monthlySalesModel.findOne({ shop: this.shop, $expr: { $and: [{ $eq: [{ $year: "$createdAt" }, date.getFullYear()] }, { $eq: [{ $month: "$createdAt" }, date.getMonth() + 1] }] } });
    if (!monthlySales) { await monthlySalesModel.create({ sales: this.totalAmountAfterDiscount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        monthlySales.sales += this.totalAmountAfterDiscount;
        monthlySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        monthlySales.save();
    };

    // * yearly sales
    const yearlySales: SalesModel | null = await yearlySalesModel.findOne({ shop: this.shop, $expr: { $eq: [{ $year: "$createdAt" }, date.getFullYear()] } });
    if (!yearlySales) { await yearlySalesModel.create({ sales: this.totalAmountAfterDiscount, earnings: this.totalAmountAfterDiscount - totalProductPrice, shop: this.shop }); }
    else {
        yearlySales.sales += this.totalAmountAfterDiscount;
        yearlySales.earnings += (this.totalAmountAfterDiscount - totalProductPrice);
        yearlySales.save();
    };
    next();
});

billSchema.pre<BillModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'products.product', select: 'name sellingPrice' });
    this.populate({ path: 'user', select: '_id name' });
    this.populate({ path: 'customer', select: '_id name phone' });
    next();
});

export default mongoose.model<BillModel>("bills", billSchema);