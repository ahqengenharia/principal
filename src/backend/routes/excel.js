const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

// Rota para iniciar Excel
router.post('/start', async (req, res) => {
  try {
    const excelPath = path.join('C:', 'Users', 'Usuario', 'Onedrive', 'ARQUIVOSDAPLATAFORMA');
    
    // Verifica se é Windows
    if (process.platform === 'win32') {
      const excel = spawn('excel.exe', ['/e'], { 
        detached: true, 
        stdio: 'ignore',
        windowsHide: true,
        cwd: excelPath
      });
      
      excel.unref();
      
      res.status(200).json({ 
        success: true,
        message: 'Excel iniciado com sucesso' 
      });
    } else {
      throw new Error('Sistema operacional não suportado');
    }
  } catch (error) {
    console.error('Erro ao iniciar Excel:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;