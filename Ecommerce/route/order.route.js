const express = require("express");

const orderController = require("../controller/order.controller");

const router = express.Router();

router.post("/create", orderController.orderCreate);

module.exports = router;