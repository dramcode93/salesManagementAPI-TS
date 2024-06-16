import mongoose from "mongoose";
import { SubSalesModel } from "../interfaces";

const dailySubSalesSchema: mongoose.Schema = new mongoose.Schema<SubSalesModel>({
    sales: { type: Number },
    earnings: { type: Number },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    subShop: { type: mongoose.Schema.Types.ObjectId, ref: "subShops" },
}, { timestamps: true });

export default mongoose.model<SubSalesModel>("dailySubSales", dailySubSalesSchema);