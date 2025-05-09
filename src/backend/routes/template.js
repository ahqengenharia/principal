const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const mammoth = require('mammoth');
const multer = require('multer');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'assets', 'templates');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'template-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Load template content
router.get('/load', async (req, res) => {
  try {
    console.log('Template load request received');
    
    const templatePath = path.join(__dirname, '..', 'assets', 'CESP relatório anual 2015_PAR (TEMPLATE).docx');
    console.log('Looking for template at:', templatePath);
    
    try {
      await fs.access(templatePath);
    } catch {
      console.error('Template file not found at:', templatePath);
      return res.status(404).json({ 
        error: 'Template file not found',
        path: templatePath
      });
    }

    const result = await mammoth.extractRawText({ path: templatePath });
    console.log('Template loaded successfully');
    
    res.json({ content: result.value });
  } catch (error) {
    console.error('Error loading template:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

// Save template content
router.post('/save', express.json(), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content not provided' });
    }

    const templatePath = path.join(__dirname, '..', 'assets', 'templates', `template-${Date.now()}.docx`);
    
    // Save content to file
    await fs.writeFile(templatePath, content);
    
    res.json({ 
      message: 'Template saved successfully',
      path: templatePath
    });
  } catch (error) {
    console.error('Error saving template:', error);
    res.status(500).json({ 
      message: 'Error saving the template', 
      error: error.message 
    });
  }
});

// Upload new template
router.post('/upload', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    
    res.json({ 
      message: 'Template uploaded successfully',
      content: result.value,
      path: req.file.path
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ 
      message: 'Error uploading the template', 
      error: error.message 
    });
  }
});

module.exports = router;