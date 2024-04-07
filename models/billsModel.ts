import mongoose from "mongoose";
import { BillModel } from "../interfaces";

const billSchema: mongoose.Schema = new mongoose.Schema<BillModel>({
    customerName: {
        type: String,
        trim: true,
        required: [true, 'customer name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    customerAddress: {
        type: String,
        trim: true,
        maxlength: [200, 'max length must be 200']
    },
    phone: { type: String },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: [true, 'product id is required']
        },
        productQuantity: { type: Number },
        totalPrice: { type: Number }
    }],
    totalAmount: { type: Number },
    paidAmount: { type: Number, required: [true, 'paid Amount is required'] },
    remainingAmount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    adminUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, { timestamps: true });

billSchema.pre<BillModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'products.product', select: 'name sellingPrice' });
    this.populate({ path: 'user', select: '_id name' });
    next();
});

export default mongoose.model<BillModel>("bills", billSchema);