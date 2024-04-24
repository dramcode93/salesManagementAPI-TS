import mongoose from "mongoose";
import { ProductModel } from "../interfaces";

const productSchema: mongoose.Schema = new mongoose.Schema<ProductModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'product name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    quantity: {
        type: Number,
        default: 0,
        required: [true, 'product quantity is required']
    },
    productPrice: {
        type: Number,
        required: [true, 'product price is required']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'selling price is required']
    },
    sold: {
        type: Number,
        default: 0,
    },
    receivedQuantity: {
        type: Number,
        default: 0,
    },
    badQuantity: {
        type: Number,
        default: 0,
    },
    images: [{ type: String }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: [true, 'category is required']
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shops"
    }
}, { timestamps: true });



productSchema.pre<ProductModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'category', select: 'name' });
    next();
});

export default mongoose.model<ProductModel>("products", productSchema);