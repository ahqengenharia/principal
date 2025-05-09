
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Default legislation documents that will be returned if API call fails
const defaultLegislations = [
  {
    id: '1',
    title: 'Resolução ANA/ANEEL 127/2022',
    description: 'Resolução conjunta que estabelece as diretrizes para o monitoramento hidrológico de usinas hidrelétricas.',
    documentType: 'pdf',
    url: '/assets/legislation/resolucao_ana_aneel_127_2022.pdf',
    agency: 'ANA',
    year: 2022,
    number: '127',
    tags: ['monitoramento', 'hidrelétrica', 'ANA', 'ANEEL']
  },
  {
    id: '2',
    title: 'Anexo I - Resolução ANA/ANEEL 127/2022',
    description: 'Anexo I da Resolução conjunta que estabelece as diretrizes para o monitoramento hidrológico.',
    documentType: 'pdf',
    url: '/assets/legislation/anexo_i_resolucao_ana_aneel_127_2022.pdf',
    agency: 'ANA',
    year: 2022,
    number: '127',
    tags: ['anexo', 'monitoramento', 'hidrelétrica']
  },
  {
    id: '3',
    title: 'Guia MMA - Monitoramento Hidrológico',
    description: 'Guia do Ministério do Meio Ambiente sobre monitoramento hidrológico de usinas hidrelétricas',
    documentType: 'pdf',
    url: '/assets/legislation/guia_mma_monitoramento.pdf',
    agency: 'MMA',
    year: 2022,
    tags: ['guia', 'monitoramento', 'hidrelétrica', 'MMA']
  },
  // Additional documents for online search
  {
    id: '4',
    title: 'Manual de Monitoramento - ANA',
    description: 'Manual técnico para implementação de sistemas de monitoramento hidrológico',
    documentType: 'pdf',
    url: '/assets/legislation/manual_monitoramento_ana.pdf',
    agency: 'ANA',
    year: 2023,
    tags: ['manual', 'monitoramento', 'hidrelétrica', 'ANA']
  },
  {
    id: '5',
    title: 'Portaria MMA 256/2022',
    description: 'Portaria que regulamenta aspectos ambientais para usinas hidrelétricas',
    documentType: 'pdf',
    url: '/assets/legislation/portaria_mma_256_2022.pdf',
    agency: 'MMA',
    year: 2022,
    number: '256',
    tags: ['portaria', 'ambiental', 'hidrelétrica', 'MMA']
  }
];

// Endpoint to search for legislation online
router.get('/search-legislation', (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).json({ 
      error: 'Query parameter is required' 
    });
  }
  
  // In a real implementation, this would search external APIs or databases
  // Here we're simulating a search by filtering our default documents
  try {
    const lowerQuery = query.toLowerCase();
    const results = defaultLegislations.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) || 
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    // Add a slight delay to simulate a real API call
    setTimeout(() => {
      res.json(results);
    }, 1000);
  } catch (error) {
    console.error('Error searching for legislation:', error);
    res.status(500).json({ 
      error: 'Failed to search for legislation'
    });
  }
});

// Endpoint to get all legislation documents
router.get('/legislation', (req, res) => {
  try {
    res.json(defaultLegislations);
  } catch (error) {
    console.error('Error fetching legislation:', error);
    res.status(500).json({ 
      error: 'Failed to fetch legislation documents'
    });
  }
});

module.exports = router;
