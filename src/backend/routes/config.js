const express = require('express');
const router = express.Router();

// In-memory storage (in a real app, this would be a database)
let clientConfig = {
  razao_social: "NOME DA UHE",
  grupo: "NOME DO GRUPO DO CLIENTE",
  responsavel_tecnico: "Responsável Técnico"
};

router.get('/', (req, res) => {
  console.log('Fetching client configuration');
  res.json(clientConfig);
});

router.post('/update', (req, res) => {
  try {
    console.log('Updating client configuration:', req.body);
    const { razao_social, grupo, responsavel_tecnico } = req.body;
    
    clientConfig = {
      razao_social: razao_social || clientConfig.razao_social,
      grupo: grupo || clientConfig.grupo,
      responsavel_tecnico: responsavel_tecnico || clientConfig.responsavel_tecnico
    };

    res.json({ 
      success: true, 
      message: 'Configurações atualizadas com sucesso',
      data: clientConfig 
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar configurações' 
    });
  }
});

module.exports = router;