const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { saveDataEntry } = require('../models/supabaseClient');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('C:', 'Users', 'Usuario', 'Onedrive', 'ARQUIVOSDAPLATAFORMA', 'dados');
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

router.post('/input', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
    }

    const dataEntry = {
      codigoANA: req.body.codigoANA || '',
      estacaoTelemetrica: req.body.estacaoTelemetrica || '',
      tipoDados: req.body.tipoDados || '',
      filename: req.file.filename,
      filetype: req.file.mimetype
    };

    const savedEntry = await saveDataEntry(dataEntry);

    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      data: savedEntry
    });
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    res.status(500).json({
      message: 'Erro ao processar o arquivo',
      error: error.message
    });
  }
});

router.get('/export-excel', async (req, res) => {
  try {
    const uploadPath = path.join('C:', 'Users', 'Usuario', 'Onedrive', 'ARQUIVOSDAPLATAFORMA', 'dados');
    const files = fs.readdirSync(uploadPath);
    const latestFile = files
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        return fs.statSync(path.join(uploadPath, b)).mtime.getTime() - 
               fs.statSync(path.join(uploadPath, a)).mtime.getTime();
      })[0];

    if (!latestFile) {
      return res.status(404).json({ message: 'No JSON file found' });
    }

    const jsonData = JSON.parse(fs.readFileSync(path.join(uploadPath, latestFile), 'utf8'));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(Array.isArray(jsonData) ? jsonData : [jsonData]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=dados_exportados.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ message: 'Error exporting to Excel' });
  }
});

router.post('/view', async (req, res) => {
  try {
    const rScript = `
      install.packages(c("shiny", "DT", "tidyverse"))
      library(shiny)
      library(DT)
      library(tidyverse)
      
      data <- read.csv("uploaded_data.csv")
      
      ui <- fluidPage(
        titlePanel("Visualização de Dados"),
        DTOutput("table")
      )
      
      server <- function(input, output) {
        output$table <- renderDT({
          datatable(data)
        })
      }
      
      shinyApp(ui = ui, server = server)
    `;

    const rScriptPath = path.join(__dirname, 'viewer.R');
    fs.writeFileSync(rScriptPath, rScript);

    const rProcess = spawn('C:\\Program Files\\R\\R-4.3.3\\bin\\Rscript.exe', [rScriptPath]);

    rProcess.stdout.on('data', (data) => {
      console.log(`R output: ${data}`);
    });

    rProcess.stderr.on('data', (data) => {
      console.error(`R error: ${data}`);
    });

    res.json({ message: 'R viewer initialized' });
  } catch (error) {
    console.error('Error starting R viewer:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/r-viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

module.exports = router;
