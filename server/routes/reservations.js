const express = require('express');
const router = express.Router();
const { findRestaurant } = require('../services/anthropic');

// Get restaurant suggestions
router.post('/find', async (req, res) => {
  try {
    const { cuisine, location, occasion, partySize, budget, preferences } = req.body;

    const response = await findRestaurant({
      cuisine,
      location,
      occasion,
      partySize,
      budget,
      preferences,
    });

    res.json({ suggestions: response.content });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ error: 'Failed to find restaurants' });
  }
});

module.exports = router;
