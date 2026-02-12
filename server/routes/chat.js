const express = require('express');
const router = express.Router();
const { chat } = require('../services/anthropic');

// In-memory conversation store (per session)
const conversations = new Map();

// Send a message and get a response
router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history
    const history = conversations.get(conversationId) || [];

    const userMessage = { role: 'user', content: message };
    const response = await chat([userMessage], history);

    // Update history
    history.push(userMessage);
    history.push({ role: 'assistant', content: response.content });
    conversations.set(conversationId, history);

    res.json({
      message: response.content,
      conversationId,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Clear conversation history
router.delete('/:conversationId', (req, res) => {
  conversations.delete(req.params.conversationId);
  res.json({ message: 'Conversation cleared' });
});

module.exports = router;
