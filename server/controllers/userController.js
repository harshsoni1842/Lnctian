import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

//signup new user
export const signup = async (req, res) => {
    const { email, fullName, password, bio } = req.body;

    try {
        if (!email || !fullName || !password || !bio) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);
        res.json({ success: true, userData: newUser, message: "User created successfully", token });

    } catch (error) {
        console.log("Error in signup", error.message);
        res.json({ success: false, message: "Error in signup" + error.message });
    }
}
export const login = async (req, res) => {

    const { email, password } = req.body; 
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({ success: false, message: "Invalid credentials user" });
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);

        if (!isPasswordMatch) {
            return res.json({ success: false, message: "Invalid credentials password" });
        }

        const token = generateToken(userData._id);
        res.json({ success: true, userData , message: "User created successfully", token });
    
    } catch (error) {
        console.log("Error in login", error.message);
        res.json({ success: false, message: "Error in login page " + error.message });
    }
}

//controller to check if the user is Authenticated or not
export const checkAuth = (req, res) => {
    res.json({ success: true, message: "User is authenticated", user: req.user });
}   

//controller to update the user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePIC } = req.body;
        const userId =  req.user._id;

        let updatedUser;

        if(!profilePIC) {
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
        } else {
            const uploadResponse = await cloudinary.uploader.upload(profilePIC);
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio, profilePIC: uploadResponse.secure_url }, { new: true });
        }
        res.json({ success: true, user: updatedUser });

    }catch (error) {
        console.log("Error in updateProfile", error.message);
        res.json({ success: false, message: "Error in updateProfile" + error.message });
    }
}