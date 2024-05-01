import mongoose from "mongoose";
import { CouponModel } from "../interfaces";
const couponSchema: mongoose.Schema = new mongoose.Schema < CouponModel >({
    name:{
        type:String,
        trim:true,
        required: [true,"coupon name is required"],
        unique: true,
    },
    expire:{
        type: Date,
        required:[true," coupon expire time is required"],
    },
    discount:{
        type:Number,
        required:[true,"coupon discount is required"],
    },
},
    { timestamps: true }
);
export default mongoose.model < CouponModel > ("coupon", couponSchema);