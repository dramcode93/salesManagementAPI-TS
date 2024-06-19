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
    image: { type: String },
    allMoney: { type: Number, default: 0 },
    productsMoney: { type: Number, default: 0 },
    debts: { type: Number, default: 0 },
}, { timestamps: true });

const imageUrl = (document: ShopModel): void => {
    if (document.image) {
        const imageUrl: string = `https://store-system-api.gleeze.com/shops/${document.image}`;
        document.image = imageUrl;
    };
};

shopSchema.post<ShopModel>('init', (document: ShopModel): void => { imageUrl(document) }).post('save', (document: ShopModel): void => { imageUrl(document) });

shopSchema.pre<ShopModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'type' });
    next();
});

export default mongoose.model<ShopModel>("shops", shopSchema);