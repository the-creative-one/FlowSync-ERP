const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getChatbotResponse } = require("../utils/chatbot");

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const reply = await getChatbotResponse(message.trim());

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
