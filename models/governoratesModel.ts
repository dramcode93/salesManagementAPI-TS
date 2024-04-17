import mongoose from "mongoose";
import { GovernorateModel } from "../interfaces";

const governorateSchema: mongoose.Schema = new mongoose.Schema<GovernorateModel>({
    governorate_name_ar: { type: String },
    governorate_name_en: { type: String }
}, { timestamps: true });

export default mongoose.model<GovernorateModel>("governorates", governorateSchema);