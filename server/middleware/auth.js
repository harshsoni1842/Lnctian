import User from "../models/user.js";
import jwt from "jsonwebtoken";

//middleware to protect routes and verify the token
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "No token provided. Please login again." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error.message);
        res.json({ success: false, message: "User not found" + error.message });
    }
}
