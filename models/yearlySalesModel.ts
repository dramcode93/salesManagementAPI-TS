import mongoose from "mongoose";
import { SalesModel } from "../interfaces";

const yearlySalesSchema: mongoose.Schema = new mongoose.Schema<SalesModel>({
    sales: { type: Number },
    earnings: { type: Number },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shops"
    },
}, { timestamps: true });

export default mongoose.model<SalesModel>("yearlySales", yearlySalesSchema);