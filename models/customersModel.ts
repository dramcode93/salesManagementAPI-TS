import mongoose from "mongoose";
import { CustomerModel } from "../interfaces";

const customerSchema: mongoose.Schema = new mongoose.Schema<CustomerModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'customer name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    address: [{
        governorate: { type: mongoose.Schema.Types.ObjectId, ref: "governorates" },
        city: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
        street: { type: String }
    }],
    phone: [{ type: String }],
    shop: {
        type: mongoose.Types.ObjectId,
        ref: "shops"
    }
}, { timestamps: true });

customerSchema.pre<CustomerModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'address.governorate' });
    this.populate({ path: 'address.city' });
    next();
});

export default mongoose.model<CustomerModel>("customers", customerSchema);