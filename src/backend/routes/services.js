const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('C:', 'Users', 'Usuario', 'Onedrive', 'ARQUIVOSDAPLATAFORMA');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route handlers for each service
const services = [
  'annual-report',
  'environmental-studies',
  'field-data',
  'hydro-data',
  'telemetric-station',
  'support',
  'water-analysis',
  'sediments',
  'cartography',
  'plant-dashboard',
  'stations-dashboard',
  'general-dashboard'
];

// Add CORS headers middleware
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

services.forEach(service => {
  router.post(`/${service}`, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
      }

      res.status(200).json({
        message: 'Arquivo enviado com sucesso',
        filename: req.file.filename
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao processar o arquivo',
        error: error.message
      });
    }
  });
});

// GLPI Integration route
router.get('/support', async (req, res) => {
  try {
    const clientData = req.query;
    
    // Configure GLPI session with client data
    const glpiConfig = {
      baseUrl: process.env.GLPI_URL || 'http://localhost/glpi',
      apiToken: process.env.GLPI_API_TOKEN,
      clientData: {
        name: clientData.razao_social,
        group: clientData.grupo,
        contract: clientData.numero_contrato,
        logo: clientData.logotipo
      }
    };

    // Store configuration in session
    req.session.glpiConfig = glpiConfig;

    // Redirect to customized GLPI interface
    res.redirect(`${glpiConfig.baseUrl}/front/helpdesk.public.php`);

  } catch (error) {
    console.error('Erro ao acessar GLPI:', error);
    res.status(500).json({ 
      message: 'Erro ao acessar sistema de suporte', 
      error: error.message 
    });
  }
});

module.exports = router;
