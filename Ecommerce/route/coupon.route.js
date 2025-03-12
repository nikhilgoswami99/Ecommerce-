const express = require("express");

const couponController = require("../controller/coupon.controller");

const router = express.Router();

router.post("/create", couponController.couponCreate);

module.exports = router;