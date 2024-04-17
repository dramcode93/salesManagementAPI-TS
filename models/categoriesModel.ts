import mongoose from "mongoose";
import { CategoryModel } from "../interfaces";

const categorySchema: mongoose.Schema = new mongoose.Schema<CategoryModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    shop: {
        type: mongoose.Types.ObjectId,
        ref: "shops"
    }
}, { timestamps: true });

export default mongoose.model<CategoryModel>("categories", categorySchema);