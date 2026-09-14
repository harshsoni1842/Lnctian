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
// import User from "../models/user.js";
// import jwt from "jsonwebtoken";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.headers.token;
//         console.log("1. Middleware received token:", token ? "YES" : "NO");

//         if (!token) {
//             return res.json({ success: false, message: "No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("2. Token decoded successfully. UserID:", decoded.userId);

//         // Humne findByID ko findById kiya tha
//         const user = await User.findById(decoded.userId).select("-password");
//         console.log("3. Database user search result:", user ? "User Found" : "User NOT Found");

//         if (!user) {
//             console.log("❌ Request blocked: User not found in DB");
//             return res.json({ success: false, message: "User not found" });
//         }

//         req.user = user;
//         console.log("4. req.user set successfully, calling next()...");
//         next();
//     } catch (error) {
//         console.log("🔥 Catch block error in Middleware:", error.message);
//         res.json({ success: false, message: "Auth Error: " + error.message });
//     }
// }