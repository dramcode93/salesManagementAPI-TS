import express from 'express';
import couponModel from "../models/couponModel";
import { CouponModel } from "../interfaces";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler";

const getCoupons = getAll<CouponModel>(couponModel, 'coupon');
const createCoupon = createOne<CouponModel>(couponModel);
const getCoupon = getOne<CouponModel>(couponModel);
const updateCoupon = updateOne<CouponModel>(couponModel);
const DeleteCoupon = deleteOne<CouponModel>(couponModel);

export { getCoupons, createCoupon, getCoupon, updateCoupon, DeleteCoupon };