const express = require('express');
const router = express.Router();
const { draftEmail, replyToEmail } = require('../services/anthropic');

// Draft a new email
router.post('/draft', async (req, res) => {
  try {
    const { context, tone, recipientName, subject } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Context is required to draft an email' });
    }

    const response = await draftEmail({ context, tone, recipientName, subject });
    res.json({ draft: response.content });
  } catch (error) {
    console.error('Email draft error:', error);
    res.status(500).json({ error: 'Failed to draft email' });
  }
});

// Reply to an email
router.post('/reply', async (req, res) => {
  try {
    const { originalEmail, instructions, tone } = req.body;

    if (!originalEmail || !instructions) {
      return res.status(400).json({ error: 'Original email and instructions are required' });
    }

    const response = await replyToEmail({ originalEmail, instructions, tone });
    res.json({ reply: response.content });
  } catch (error) {
    console.error('Email reply error:', error);
    res.status(500).json({ error: 'Failed to generate reply' });
  }
});

module.exports = router;
