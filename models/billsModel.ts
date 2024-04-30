import mongoose from "mongoose";
import { BillModel } from "../interfaces";

const billSchema: mongoose.Schema = new mongoose.Schema<BillModel>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, 'customer id is required'],
    },
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
    await this.populate({ path: 'products.product', select: 'sellingPrice' });
    const products = this.products;
    let total: number = 0;
    for (const item of products) {
        const totalPrice: number = item.product.sellingPrice * item.productQuantity;
        item.totalPrice = totalPrice;
        total += totalPrice;
    };
    this.totalAmountBeforeDiscount = total;
    this.remainingAmount = total - this.paidAmount;
    if (this.discount !== 0) { this.totalAmountAfterDiscount = (this.discount / 100) * this.totalAmountBeforeDiscount; }
    else { this.totalAmountAfterDiscount = this.totalAmountBeforeDiscount; };
    next();
});

billSchema.pre<BillModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'products.product', select: 'name sellingPrice' });
    this.populate({ path: 'user', select: '_id name' });
    next();
});

export default mongoose.model<BillModel>("bills", billSchema);