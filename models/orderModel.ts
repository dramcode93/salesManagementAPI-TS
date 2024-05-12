import mongoose from "mongoose";
import { OrderModel } from "../interfaces";

const orderSchema: mongoose.Schema = new mongoose.Schema<OrderModel>({
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

    orderSchema.pre<OrderModel>(/^find/, function (next: mongoose.CallbackWithoutResultAndOptionalError): void {
    this.populate({ path: 'cartItems.product', select: 'name sellingPrice images shop' });
    this.populate({path : 'user',select:'name phone email address'});
    next();
});

export default mongoose.model<OrderModel>("orders", orderSchema);