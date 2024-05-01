import mongoose from "mongoose";
import { CartModel } from "../interfaces";
const cartSchema: mongoose.Schema = new mongoose.Schema<CartModel>({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "products"
        },
        productQuantity: { type: Number },
        totalPrice: { type: Number },
    }],
    totalCartPrice: { type: Number },
    totalPriceAfterDiscount: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
}, { timestamps: true });

cartSchema.pre<CartModel>('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError): Promise<void> {
    await this.populate({ path: 'cartItems.product', select: 'sellingPrice' });
    const products = this.cartItems;
    let total: number = 0;
    for (const item of products) {
        const totalPrice: number = item.product.sellingPrice * item.productQuantity;
        item.totalPrice = totalPrice;
        total += totalPrice;
    };
    this.totalCartPrice = total;
    next();
});

export default mongoose.model<CartModel>("carts", cartSchema);