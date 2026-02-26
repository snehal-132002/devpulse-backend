import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import User from "../models/User.js";

export const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new tokens (ROTATION)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace old refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    return res.status(403).json({ message: "Token expired or invalid" });
  }

};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};