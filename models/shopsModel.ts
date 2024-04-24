import mongoose from "mongoose";
import { ShopModel } from "../interfaces";

const shopSchema: mongoose.Schema = new mongoose.Schema<ShopModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'shop name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
}, { timestamps: true });

export default mongoose.model<ShopModel>("shops", shopSchema);