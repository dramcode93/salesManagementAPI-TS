import mongoose from "mongoose";
import { OrderModel } from "../interfaces";

const orderSchema: mongoose.Schema = new mongoose.Schema<OrderModel>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: [true, "order must be belong to user"] },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops", required: [true, "order must be belong to shop"] },
    subShop: { type: mongoose.Schema.Types.ObjectId, ref: "subShops", required: [true, "order must be belong to sub shop"] },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "products"
        },
        productQuantity: Number,
        totalPrice: { type: Number },
    }],
    totalOrderPrice: { type: Number },
    paymentMethodType: {
        type: String,
        enum: ["cash", "online"],
        default: "cash"
    },
    receivingMethod: {
        type: String,
        enum: ["delivery", "shop"],
        default: "delivery"
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

}
    , { timestamps: true })

orderSchema.pre<OrderModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'cartItems.product', select: 'name sellingPrice images shop' });
    this.populate({ path: 'user', select: 'name phone email address' });
    this.populate({ path: 'shop', select: 'name image' });
    this.populate({ path: 'subShop', select: 'name' });
    next();
});

export default mongoose.model<OrderModel>("orders", orderSchema);