const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

router.get('/map', async (req, res) => {
  try {
    const readmePath = path.join(__dirname, '../../README.md');
    const content = await fs.readFile(readmePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading platform map:', error);
    res.status(500).json({ 
      error: 'Error reading platform map',
      message: error.message 
    });
  }
});

module.exports = router;