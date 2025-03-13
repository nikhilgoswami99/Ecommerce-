const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./route/user.route");
const productRoutes = require("./route/product.route");
const cartRoutes = require("./route/cart.route");
const couponRoutes = require("./route/coupon.route");
const orderRoutes = require("./route/order.route");

const authMiddleware = require("./middlewares/authMiddleware");


const app = express();



// Global Middlewares
app.use(express.json());

const DB_URI = "mongodb+srv://nikhilgoswami18121999:n18121999@cluster0.crlqe.mongodb.net/?retryWrites=true&w=majority";



// Modular Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", authMiddleware, productRoutes);
app.use("/api/v1/cart", authMiddleware, cartRoutes);
app.use("/api/v1/coupon", authMiddleware, couponRoutes);
app.use("/api/v1/order", authMiddleware, orderRoutes);

mongoose
.connect(DB_URI)
.then(() => console.log("DB is connected successfully"))
.catch((err) => console.error("Error while connecting database", err))

app.listen(5000, () => {
    console.log("server is up and running at port 5000");
    
    
});