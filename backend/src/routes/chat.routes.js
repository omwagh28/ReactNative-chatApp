const express = require("express");
const Conversation = require("../models/Conversation");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * CREATE or GET conversation
 */
router.post("/", protect, async (req, res) => {
  const { userId } = req.body;

  let conversation = await Conversation.findOne({
    members: { $all: [req.user.id, userId] },
  }).populate("members", "name email");

  if (!conversation) {
    conversation = await Conversation.create({
      members: [req.user.id, userId],
    });

    conversation = await conversation.populate("members", "name email");
  }

  res.json(conversation);
});

/**
 * ✅ GET single conversation (FOR CHAT HEADER NAME)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const chat = await Conversation.findById(req.params.id)
      .populate("members", "name email"); // ✅ FIXED

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 🔥 find the OTHER user
    const receiver = chat.members.find(
      (m) => m._id.toString() !== req.user.id
    );

    res.json({ receiver });
  } catch (err) {
    console.log("CHAT LOAD ERROR:", err.message);
    res.status(500).json({ message: "Failed to load chat info" });
  }
});

module.exports = router;
