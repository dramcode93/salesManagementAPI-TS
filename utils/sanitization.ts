import { ShopModel, UserModel } from "../interfaces";

export const sanitizeUser = function (user: any) {
    return {
        _id: user._id,
        username: user?.username,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        role: user?.role,
        active: user?.active,
        shop: user?.shop,
    };
};

export const sanitizeShop = function (shop: any) {
    return {
        _id: shop._id,
        name: shop.name,
        type: shop.type,
        phone: shop.phone,
        address: shop.address,
    };
};