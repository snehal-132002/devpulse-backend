import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generatedAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

export const generatedRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};