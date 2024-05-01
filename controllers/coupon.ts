import express from 'express';
import couponModel from "../models/couponModel";
import { CouponModel, FilterData } from "../interfaces";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./refactorHandler";

const getCoupons = getAll<CouponModel>(couponModel, 'coupons');
const createCoupon = createOne<CouponModel>(couponModel);
const getCoupon = getOne<CouponModel>(couponModel, 'coupons');
const updateCoupon = updateOne<CouponModel>(couponModel);
const DeleteCoupon = deleteOne<CouponModel>(couponModel);

const filterCoupons = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    // ! important update after e-commerce frontend
    let filterData: FilterData = {};
    if (req.user?.role !== 'customer') { filterData.shop = req.user?.shop; };
    req.filterData = filterData;
    next();
};

export { getCoupons, createCoupon, getCoupon, updateCoupon, DeleteCoupon, filterCoupons };