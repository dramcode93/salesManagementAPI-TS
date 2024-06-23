import mongoose from "mongoose";
import { CompanyModel } from "../interfaces";

const companiesSchema: mongoose.Schema = new mongoose.Schema<CompanyModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'name is required'],
        minlength: [2, 'name min length must be 2'],
        maxlength: [50, 'name max length must be 50']
    },
    phone: { type: String },
    address: {
        governorate: { type: mongoose.Schema.Types.ObjectId, ref: "governorates" },
        city: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
        street: { type: String }
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
}, { timestamps: true });

// TODO companiesSchema.virtual("PurchasesBills", { ref: "PurchasesBills", foreignField: "company", localField: "_id" });

companiesSchema.pre<CompanyModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'address.governorate' });
    this.populate({ path: 'address.city' });
    next();
});

export default mongoose.model<CompanyModel>("companies", companiesSchema);