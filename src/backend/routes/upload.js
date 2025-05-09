const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const paths = [
      path.join(__dirname, '..', 'assets', 'images', 'templates'),
      'C:/PLATAFORMA AHQ TESTE'
    ];
    
    paths.forEach(path => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    });
    
    cb(null, paths[0]); // Save to the first path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Receiving file:', file.originalname);
    cb(null, true);
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File upload started');
    
    if (!req.file) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file received' });
    }

    console.log('File saved:', {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });

    // Also save to the second location
    const secondPath = path.join('C:', 'PLATAFORMA AHQ TESTE', req.file.filename);
    fs.copyFileSync(req.file.path, secondPath);
    
    console.log('File copied to second location:', secondPath);

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;