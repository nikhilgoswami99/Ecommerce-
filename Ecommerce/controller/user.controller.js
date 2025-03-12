const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


const userModel = require("../model/user.model");
const UserModel = require("../model/user.model");

const JWT_SECRET_KEY = "My-JWT-key";

const register = async (req, res, next) => {

    try {

        await userModel.create(req.body);

        res.json({
            success: true,
            message: "User registered successfully"
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res) => {
    /**
     * Login successful => email & password combination should match
     */

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        res
            .status(400)
            .json({
                success: false,
                message: "Incorrect username or password"
            });
        return;
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    // JWT => JSON Web Token (String)
    if (isPasswordValid) {

        const currentTimeInSec = parseInt(Date.now() / 1000);
        const tokenData = {
            // iat: currentTimeInSec,
            _id: user._id
        };
        const token = jwt.sign(tokenData, JWT_SECRET_KEY, {
            expiresIn: 7200, // Expiry in seconds
            notBefore: 0
        });

        // DB update for this token / Store this token in DB
        await userModel
        .findByIdAndUpdate(user._id, { token: token });
        res.cookie("token", token);
        res.json({
            success: true,
            message: "Logged in successfully",
            token: token
        })
        return;
    }
    res.status(400).json({
        success: false,
        message: "Incorrect username or password"
    });
};

const userController = {
    register,
    login
}

module.exports = userController;