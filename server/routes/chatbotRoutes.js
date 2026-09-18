const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getChatbotResponse } = require("../utils/chatbot");
const ChatMessage = require("../models/ChatMessage");

const allowedPermissions = [
  "canCreateOrders",
  "canUpdateOrders",
  "canDeleteOrders",
  "canManageEmployees",
  "canViewAdvancedAnalytics",
  "canExportReports",
  "canAccessSettings",
];

// GET CHAT HISTORY
router.get("/history", protect, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      userId: req.user._id,
    })
      .sort({ createdAt: 1 })
      .limit(50)
      .select("role content createdAt");

    res.json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch chat history",
    });
  }
});

// CLEAR CHAT HISTORY
router.delete("/history", protect, async (req, res) => {
  try {
    await ChatMessage.deleteMany({
      userId: req.user._id,
    });

    res.json({
      message: "Chat history cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to clear chat history",
    });
  }
});

// SEND MESSAGE
router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const permissions = req.user.permissions || {};

    const userPermissions = {};

    for (const permission of allowedPermissions) {
      userPermissions[permission] = !!permissions[permission];
    }

    const previousMessages = await ChatMessage.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("role content");

    const conversationHistory = previousMessages.reverse();

    const reply = await getChatbotResponse(
      message.trim(),
      {
        role: req.user.role,
        permissions: userPermissions,
      },
      conversationHistory,
    );

    await ChatMessage.create([
      {
        userId: req.user._id,
        role: "user",
        content: message.trim(),
      },
      {
        userId: req.user._id,
        role: "assistant",
        content: reply,
      },
    ]);

    res.json({
      reply,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get chatbot response",
    });
  }
});

module.exports = router;
