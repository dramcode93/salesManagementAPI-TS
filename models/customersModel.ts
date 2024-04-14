import mongoose from "mongoose";
import { CustomerModel } from "../interfaces";

const customerSchema: mongoose.Schema = new mongoose.Schema<CustomerModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'max length must be 200']
    },
    phone: { type: String },
    adminUser: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

export default mongoose.model<CustomerModel>("customers", customerSchema);