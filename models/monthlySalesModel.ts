import mongoose from "mongoose";
import { SalesModel } from "../interfaces";

const monthlySalesSchema: mongoose.Schema = new mongoose.Schema<SalesModel>({
    sales: { type: Number },
    earnings: { type: Number },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shops"
    },
}, { timestamps: true });

export default mongoose.model<SalesModel>("monthlySales", monthlySalesSchema);