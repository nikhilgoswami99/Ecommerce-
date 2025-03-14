const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cors = require("cors");
// const rateLimit = require("express-rate-limit");

const userRoutes = require("./route/user.route");
const productRoutes = require("./route/product.route");
const cartRoutes = require("./route/cart.route");
const couponRoutes = require("./route/coupon.route");
const orderRoutes = require("./route/order.route");

const authMiddleware = require("./middlewares/authMiddleware");


const app = express();

dotenv.config();

// Global Middlewares
app.use(express.json());

const DB_URI = process.env.DB_URI;



// Modular Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/order", orderRoutes);

mongoose
.connect(DB_URI)
.then(() => console.log("DB is connected successfully"))
.catch((err) => console.error("Error while connecting database", err))

app.listen(5000, () => {
    console.log("server is up and running at port 5000");
    
    
});