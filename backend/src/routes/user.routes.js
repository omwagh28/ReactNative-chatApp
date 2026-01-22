const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

// GET all users (already exists)
router.get("/", protect, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } })
    .select("name email");
  res.json(users);
});

// 🔥 UPDATE PROFILE (NAME)
router.put("/profile", protect, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("name email");

  res.json(user);
});

// 🔐 CHANGE PASSWORD
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ⚠️ IMPORTANT: select("+password")
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // bcrypt runs in pre-save
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Failed to update password" });
  }
});

module.exports = router;