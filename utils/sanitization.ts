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
        subShop: user?.subShop,
    };
};

export const sanitizeShop = function (shop: any) {
    return {
        _id: shop._id,
        name: shop.name,
        type: shop.type,
        image: shop.image
    };
};

export const sanitizeSubShop = function (subShop: any) {
    return {
        _id: subShop._id,
        name: subShop.name,
        address: subShop.address,
        phone: subShop.phone,
        onlinePaymentMethods: subShop.onlinePaymentMethods,
        deliveryService: subShop.deliveryService,
        shippingPrice: subShop.shippingPrice,
        active: subShop.active,
        shop: subShop.shop,
    };
};