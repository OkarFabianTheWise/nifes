import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authenticateToken, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

const SUPERADMIN_EMAILS = [
    "samuelpeteropeyemi@gmail.com",
    "nifesgkfut@gmail.com"
];

// 📌 Initialize superadmins (run once or check if they exist)
export const initializeSuperadmins = async () => {
    try {
        for (const email of SUPERADMIN_EMAILS) {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(email, 10); // Default password is email
                await User.create({
                    email,
                    password: hashedPassword,
                    role: 'superadmin',
                    name: email.split('@')[0]
                });
                console.log(`✅ Superadmin created: ${email}`);
            }
        }
    } catch (error) {
        console.error("Error initializing superadmins:", error);
    }
};

// 🔑 Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, role: user.role, name: user.name }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// 🔑 Change password
router.post("/change-password", authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current and new passwords are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

// 👤 Get current user
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// 👥 Get all users (superadmin only)
router.get("/", authenticateToken, authorize("superadmin"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// ➕ Add admin (superadmin only)
router.post("/add-admin", authenticateToken, authorize("superadmin"), async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Default password is the email
        const hashedPassword = await bcrypt.hash(email, 10);
        const newAdmin = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin',
            name: name || email.split('@')[0]
        });

        res.json({
            message: "Admin added successfully",
            user: { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role, name: newAdmin.name }
        });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ error: "Failed to add admin" });
    }
});

// ➖ Remove admin (superadmin only)
router.delete("/remove-admin/:userId", authenticateToken, authorize("superadmin"), async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (SUPERADMIN_EMAILS.includes(user.email)) {
            return res.status(403).json({ error: "Cannot remove superadmin" });
        }

        await User.findByIdAndDelete(userId);

        res.json({ message: "Admin removed successfully" });
    } catch (error) {
        console.error("Error removing admin:", error);
        res.status(500).json({ error: "Failed to remove admin" });
    }
});

// 🔄 Update user role (superadmin only)
router.put("/update-role/:userId", authenticateToken, authorize("superadmin"), async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = role;
        await user.save();

        res.json({
            message: "Role updated successfully",
            user: { id: user._id, email: user.email, role: user.role, name: user.name }
        });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ error: "Failed to update role" });
    }
});

export default router;
