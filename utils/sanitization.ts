import { UserModel } from "../interfaces";

export const sanitizeUser = function (user: UserModel | any) {
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