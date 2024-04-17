import mongoose from "mongoose";
import { CityModel } from "../interfaces";

const citySchema: mongoose.Schema = new mongoose.Schema<CityModel>({
    governorate: { type: mongoose.Schema.Types.ObjectId, required: [true, 'governorate is required'], },
    city_name_ar: { type: String },
    city_name_en: { type: String }
}, { timestamps: true });

export default mongoose.model<CityModel>("cities", citySchema);