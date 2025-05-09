const express = require('express');
const router = express.Router();
const { getClientData } = require('../models/supabaseClient');

router.get('/data', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  try {
    console.log('Fetching client data...');
    
    const mockClientData = {
      responsavel_tecnico: "Responsável Técnico",
      razao_social: "NOME DA UHE",
      grupo: "NOME DO GRUPO DO CLIENTE"
    };

    // First try to get data from database
    try {
      const clientId = req.query.clientId || '1'; // Default to first client
      const clientData = await getClientData(clientId);
      if (clientData) {
        console.log('Client data found:', clientData);
        return res.json(clientData);
      }
    } catch (dbError) {
      console.log('Database not available, using mock data:', dbError);
    }
    
    console.log('Using mock data');
    res.json(mockClientData);
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;