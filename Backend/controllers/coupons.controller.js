import Coupon from "../models/coupon.model.js";


export const getCoupon = async (req, resp) => {
    try {
        if (!req.user) {
            return resp.status(401).json({
                message: "Please login first"
            })
        }
        const coupons = await Coupon.findOne({ userId: req.user._id, isActive: true });
        resp.status(200).json(coupons);
    } catch (error) {
        console.log(`Error in getCoupon,:${error}`)
        resp.status(500).json(error);
    }
}

export const validateCoupon = async (req, resp) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

        if (!coupon) {
            return resp.status(404).json({
                message: "Coupon not found"
            });
        };
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return resp.status(404).json({
                message: "Coupon expired"
            })
        }

        resp.status(200).json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.log('errrrrrrrrrrrrrrrr', error.message);
        console.log(`Error in validation of coupon, ${error}`);
        resp.status(500).json({
            message: "Servor Error, (validation of coupon)",
            error
        })
    }
}