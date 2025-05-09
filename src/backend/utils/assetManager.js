const path = require('path');
const fs = require('fs');

const ASSET_PATHS = {
  IMAGES_DIR: path.join(__dirname, '..', 'assets', 'images'),
  LOGOS_DIR: path.join(__dirname, '..', 'assets', 'images', 'logos'),
  TEMPLATES_DIR: path.join(__dirname, '..', 'assets', 'templates'),
  UPLOADS_DIR: path.join(__dirname, '..', 'assets', 'images', 'uploads')
};

// Criar diretórios se não existirem
Object.values(ASSET_PATHS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const getMainLogoPath = () => {
  return path.join(ASSET_PATHS.LOGOS_DIR, 'logo-principal.png');
};

const getTemplatePath = (templateName) => {
  return path.join(ASSET_PATHS.TEMPLATES_DIR, templateName);
};

const saveUploadedImage = (file, filename) => {
  const filePath = path.join(ASSET_PATHS.UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, file.buffer);
  return filePath;
};

module.exports = {
  ASSET_PATHS,
  getMainLogoPath,
  getTemplatePath,
  saveUploadedImage
};