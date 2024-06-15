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
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "shopTypes"
    }],
    allMoney: { type: Number, default: 0 },
    productsMoney: { type: Number, default: 0 },
    debts: { type: Number, default: 0 },
}, { timestamps: true });

shopSchema.pre<ShopModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'type' });
    next();
});

export default mongoose.model<ShopModel>("shops", shopSchema);