import mongoose from "mongoose";
import { FinancialTransactionsModel } from "../interfaces";

const financialTransactionsSchema: mongoose.Schema = new mongoose.Schema<FinancialTransactionsModel>({
    money: {
        type: Number,
        required: [true, 'money is required'],
    },
    transaction: {
        type: String,
        required: [true, 'transaction is required'],
        enum: ["withdraw", "deposit"]
    },
    reason: {
        type: String,
        required: [true, "reason is required"],
        minlength: [2, 'min length must be 2'],
        maxlength: [150, 'max length must be 150']
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    subShop: { type: mongoose.Schema.Types.ObjectId, ref: "subShops" },
}, { timestamps: true });

financialTransactionsSchema.pre<FinancialTransactionsModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'subShop', select: '_id name' });
    next();
});


export default mongoose.model<FinancialTransactionsModel>("financialTransactions", financialTransactionsSchema);