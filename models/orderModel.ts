import mongoose from "mongoose";
import { orderModel } from "../interfaces";

const orderSchema: mongoose.Schema = new mongoose.Schema<orderModel>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "order must be belong to user"]
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "products"
        },
        productQuantity: Number,
        totalPrice: { type: Number },
    }],
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: {
        type: Number
    },
    paymentMethodType: {
        type: String,
        enum: ["cash", "vodafone cash"],
        default: "cash"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,

}
    , { timestamps: true })
export default mongoose.model<orderModel>("orders", orderSchema);