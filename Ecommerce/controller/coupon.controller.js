const CouponModel = require("../model/coupon.model");

const couponCreate = async (req, res) => {

    await CouponModel.create(req.body);
    res.json({
        success: true,
        message: "Copuon created successfully"
    });
};

const couponController = {
    couponCreate
};

module.exports = couponController;