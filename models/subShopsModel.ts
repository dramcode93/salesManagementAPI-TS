import mongoose from "mongoose";
import { SubShopModel } from "../interfaces";

const subShopSchema: mongoose.Schema = new mongoose.Schema<SubShopModel>({
    name: {
        type: String,
        trim: true,
        required: [true, 'sub shop name is required'],
        minlength: [2, 'min length must be 2'],
        maxlength: [50, 'max length must be 50']
    },
    address: {
        governorate: { type: mongoose.Schema.Types.ObjectId, ref: "governorates" },
        city: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
        street: { type: String }
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    phone: [{ type: String }],
    allMoney: { type: Number, default: 0 },
    productsMoney: { type: Number, default: 0 },
    debts: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    deliveryService: { type: Boolean },
    onlinePaymentMethods: [{ name: { type: String }, account: { type: String } }],
    active: { type: Boolean, default: true },
}, { timestamps: true });

subShopSchema.pre<SubShopModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'address.governorate' });
    this.populate({ path: 'address.city' });
    next();
});

export default mongoose.model<SubShopModel>("subShops", subShopSchema);