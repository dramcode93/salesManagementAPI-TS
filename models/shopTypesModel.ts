import mongoose from "mongoose";
import { ShopTypeModel } from "../interfaces";

const shopTypeSchema: mongoose.Schema = new mongoose.Schema<ShopTypeModel>({
    type: {
        type: String,
        required: [true, 'shop type is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    }
}, { timestamps: true });

export default mongoose.model<ShopTypeModel>("shopTypes", shopTypeSchema);