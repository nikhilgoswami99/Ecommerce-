const dayjs = require("dayjs");

const CartModel = require("../model/cart.model");
const CouponModel = require("../model/coupon.model");
const OrderModel = require("../model/order.model");
const ProductModel = require("../model/product.model");

const orderCreate = async (req, res) => {

    const userCart = await CartModel
        .findOne({ userId: req.user._id })
        .populate("products.productId")
    // console.log(JSON.stringify(userCart));


    if (!userCart || userCart.products.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please add at least 1 product in your cart to place an order"
        });
    }


    const productsList = userCart.products;

    const total = productsList.reduce((acc, cV) => (cV.productId.price * cV.qty) + acc, 0);

    let discountInRs = 0;
    let amountToBePaid = total;
    if (req.body.couponCode) {
        const couponDetails = await CouponModel.findOne({ code: req.body.couponCode });
        if (!couponDetails) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Coupon is invalid or expired"
                });
        }
        const couponExpiryDate = dayjs(couponDetails.validTill);
        const currentDate = dayjs();

        const isValid = currentDate.isBefore(couponExpiryDate);

        if (!isValid) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Coupon is invalid or expired"
                });
        }

        if (total < couponDetails.minAmountRequired) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: `Minimum amount required to claim this coupon is Rs ${couponDetails.minAmountRequired}`
                });
        }


        discountInRs = (total / 100) * couponDetails.discountPercentage;
        discountInRs = discountInRs > couponDetails.maxDiscountInRs ? couponDetails.maxDiscountInRs : discountInRs;

        amountToBePaid = (total - discountInRs).toFixed(2);
    }


    if (req.body.paymentMode === "ONLINE") {
        // Todo: Payment gateway redirection
    }

    const productsOrdered = userCart.products.map(product => ({ productId: product.productId._id, qty: product.qty }));
    const orderDetails = {
        paymentMode: req.body.paymentMode,
        shippingAddress: req.body.shippingAddress,
        user: req.user._id,
        totalAmount: total,
        discountAmount: discountInRs,
        amountToBePaid: amountToBePaid,
        productDetails: productsOrdered
    };

    const insertedOrderDetails = await OrderModel.create(orderDetails);

    await CartModel.deleteOne({ userId: req.user._id });

    productsOrdered.forEach(async product => {
        await ProductModel.findByIdAndUpdate(product.productId, {
            $inc: {
                stock: -product.qty
            }
        })
    });

    res.json({
        success: true,
        message: `Order placed succesfully, order id : ${insertedOrderDetails._id}`
    })
};


const orderController = {
    orderCreate
};

module.exports = orderController;