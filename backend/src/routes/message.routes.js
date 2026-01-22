const express = require("express");
const Message = require("../models/Message");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

/* GET */
router.get("/:conversationId", protect, async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  })
    .populate("sender", "name")
    .sort({ createdAt: 1 });

  res.json(messages);
});

/* SEND */
router.post("/", protect, async (req, res) => {
  const { conversationId, text } = req.body;

  const message = await Message.create({
    conversationId,
    sender: req.user.id,
    text,
  });

  const populated = await message.populate("sender", "name");
  res.json(populated);
});

/* EDIT */
router.put("/edit/:id", protect, async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json({ message: "Not found" });

  if (message.sender.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  message.text = req.body.text;
  message.isEdited = true;
  await message.save();

  const populated = await message.populate("sender", "name");
  res.json(populated);
});

/* DELETE FOR EVERYONE */
router.delete("/:id", protect, async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json({ message: "Not found" });

  if (message.sender.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  message.text = "";
  message.isDeleted = true;
  await message.save();

  res.json({ success: true });
});

// MARK MESSAGES AS SEEN
router.put("/seen/:conversationId", protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: { $ne: req.user.id },
        status: "sent",
      },
      { status: "seen" }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark seen" });
  }
});


module.exports = router;
