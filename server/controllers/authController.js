const axios = require("axios");
const jwt = require("jsonwebtoken");
// const { promisify } = require('util');
const oauth2Client = require("../utils/oauth2client");
const catchAsync = require("./../utils/catchAsync");
const User = require("../models/userModel");
require("dotenv").config();

// Secure passkey stored in .env file
const DEVELOPER_PASSKEY = process.env.DEVELOPER_PASSKEY || "passkey";
const FACILITATOR_PASSKEY = process.env.FACILITATOR_PASSKEY || "passkey";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
};
// Create and send Cookie ->
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    console.log(process.env.JWT_COOKIE_EXPIRES_IN);
    const cookieOptions = {
        expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
    };
    // if (process.env.NODE_ENV === "production") {
    //     cookieOptions.secure = true;
    //     cookieOptions.sameSite = "none";
    // }

    // user.password = undefined;

    res.cookie("jwt", token, cookieOptions);

    console.log(user);
    console.log("Cookie stored");
    
    res.status(statusCode).json({
        message: "success",
        token,
        data: {
            user,
        },
    });
};
/* GET Google Authentication API. */
exports.googleAuth = catchAsync(async (req, res, next) => {
    try {
        const code = req.query.code;
        console.log("USER CREDENTIAL -> ", code);

        const googleRes = await oauth2Client.oauth2Client.getToken(code);

        oauth2Client.oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        let user = await User.findOne({ email: userRes.data.email });
        var isNewUser = 0

        if (!user) {
            isNewUser = 1;
            console.log("New User found");
            user = await User.create({
                name: userRes.data.name,
                email: userRes.data.email,
                image: userRes.data.picture,
            });
        }

        createSendToken(user, isNewUser?201:200, res);
    } catch (err) {
        next(err);
    }
});

exports.checkStatus = catchAsync(async (req, res, next) => {
    try {
        if (!req.user) return res.status(404).json({ message: "No user to logout" });
        let user = await User.findOne({ _id: req.user.id });
        if (user) {
            return res.status(200).json({ message: "User is authenticated", user: user });
        }
        return res.status(404).json({ message: "User not found! You have been deleted! Login again" });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
});

exports.logout = catchAsync(async (req, res) => {
    try {
        // Clear the JWT cookie by setting it to an expired date

        res.cookie("jwt", "", {
            expires: new Date(0), // immediate expiration
            httpOnly: true, // Prevent client-side access to the cookie
            secure: true,
            sameSite: "none", // Ensures the cookie is sent in a same-site context
            path: "/", // Make sure it's cleared for the entire site
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log("ERROR IN LOGOUT: " + err.message);
        next(err);
    }
});

exports.validatePasskey = catchAsync(async (req, res, next) => {
    try {
        // Extract passkey from the Authorization header
        const passkey = req.headers.authorization?.replace("Bearer ", "");
        const newAdmin = req.body

        console.log(req.headers)
        console.log(req);
        

        if (!passkey) {
            return res.status(404).json({ status: "Not Found", message: "Passkey not found" });
        }

        if (passkey === FACILITATOR_PASSKEY) {
            const adminData = await Admin.create({
                name: newAdmin.name,
                email: newAdmin.email,
                image: newAdmin.image,
                role: 'Facilitator'
            });
            return res.status(200).json({
                status: "success",
                role: "Facilitator",
                message: "Facilitator access granted for Rebeca admin.",
                data: adminData
            });
        }

        if (passkey === ORGANISER_PASSKEY) {
            const adminData = await Admin.create({
                name: newAdmin.name,
                email: newAdmin.email,
                image: newAdmin.image,
                role: 'Organiser'
            });
            return res.status(200).json({
                status: "success",
                role: "Organiser",
                message: "Organiser access granted for Rebeca admin.",
                data: adminData
            });
        }

        // If passkey is invalid
        return res.status(401).json({
            status: "error",
            message: "Invalid passkey. Access denied.",
        });
    } catch (err) {
        next(err);
    }
});
