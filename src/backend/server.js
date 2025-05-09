
const express = require('express');
const cors = require('cors');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');
const hydrologicalDataRoutes = require('./routes/hydrologicalData');
const configRoutes = require('./routes/config');
const templateRoutes = require('./routes/template');
const legislationRoutes = require('./routes/legislation');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost',
  'https://github.com/ahqengenharia/aqua-logic-weaver',
  'https://lov-p-46613b5a-edb3-4db3-9351-31f58ebd7b12.fly.dev',
  'https://46613b5a-edb3-4db3-9351-31f58ebd7b12.lovableproject.com',
  'https://afgruahlfvcdtpvnoyfo.supabase.co',
  'https://azotnhzhyisqadvvaywj.supabase.co'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));

// Add routes
app.use('/functions/v1/template', templateRoutes);
app.use('/ahq/api/hydrological', hydrologicalDataRoutes);
app.use('/ahq/api/config', configRoutes);
app.use('/api', legislationRoutes);

// Health check endpoint
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Mock client data endpoint for development
app.get('/client/data', (req, res) => {
  res.json({
    razao_social: "NOME DA UHE",
    grupo: "NOME DO GRUPO DO CLIENTE",
    responsavel_tecnico: "Responsável Técnico"
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- /functions/v1/template/load');
  console.log('- /functions/v1/template/save');
  console.log('- /functions/v1/template/upload');
  console.log('- /api/search-legislation');
  console.log('- /api/legislation');
  console.log('- /client/data');
  console.log('- /health');
});

module.exports = app;
