const express = require('express');
const router = express.Router();
const { supabase } = require('../models/supabaseSchema');

// Route to save river data
router.post('/river-data', async (req, res) => {
  try {
    const data = req.body;
    const result = await saveRiverData(data);
    res.json(result);
  } catch (error) {
    console.error('Error saving river data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to save rainfall data
router.post('/rainfall-data', async (req, res) => {
  try {
    const data = req.body;
    const result = await saveRainfallData(data);
    res.json(result);
  } catch (error) {
    console.error('Error saving rainfall data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get rating curve
router.get('/rating-curve/:stationCode', async (req, res) => {
  try {
    const { stationCode } = req.params;
    const curve = await calculateRatingCurve(stationCode);
    res.json(curve);
  } catch (error) {
    console.error('Error calculating rating curve:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;