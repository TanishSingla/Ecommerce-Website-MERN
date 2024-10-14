const { redis } = require('../lib/redis.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

// for generating access and refresh tokens.
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    return { accessToken, refreshToken };
};

// for storing refresh tokens in redis.
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

const setCookies = (resp, accessToken, refreshToken) => {
    resp.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks
        maxAge: 15 * 60 * 1000, // 15 min
    });

    resp.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

const signup = async (req, resp) => {
    const { email, password, name } = req.body;

    try {
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return resp.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            name, email, password
        });

        // authenticate.
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(resp, accessToken, refreshToken);

        // password is hashed in user model
        resp.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "User created Successfully"
        });
    } catch (error) {
        resp.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const { refreshToken, accessToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(resp, accessToken, refreshToken);
            resp.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Login Successful"
            });
        } else {
            resp.status(401).json({
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        console.log(`Error in auth controller while login : ${error}`);
        resp.status(500).json({ message: error.message });
    }
};

const logout = async (req, resp) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(decode);
            await redis.del(`refresh_token:${decode.userId}`);
        }

        resp.clearCookie("refreshToken");
        resp.clearCookie("accessToken");
        resp.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        resp.status(500).json({
            message: `Server Error, While logging out, error: ${error.message}`
        });
    }
};

// for refreshing tokens. (basically for creating new access token)
const refreshToken = async (req, resp) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return resp.status(401).json({
                message: "No refresh token, Please Login again"
            });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // comparing refresh token with token stored in redis.
        const storedRefreshRedisToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedRefreshRedisToken !== refreshToken) {
            return resp.status(401).json({
                message: "Invalid Token, Please Login again",
                success: false
            });
        }

        // generating a new access token.
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        });
        resp.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        resp.status(200).json({
            message: "Token refreshed successfully",
        });
    } catch (error) {
        resp.status(500).json({
            message: `Internal Server Error. error:${error.message}`
        });
    }
};

const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { signup, login, logout, refreshToken, getProfile }; // Exporting the functions
