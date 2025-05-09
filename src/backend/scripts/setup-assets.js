const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join('C:', 'Users', 'Luis gustavo', 'OneDrive', 'ARQUIVOS DA PLATAFORMA TESTE');
const targetDirs = [
  path.join(__dirname, '..', 'assets', 'images', 'templates'),
  path.join('C:', 'Users', 'Usuario', 'OneDrive', 'ARQUIVOS DA PLATAFORMA TESTE')
];

async function copyAssets() {
  try {
    // Ensure target directories exist
    for (const dir of targetDirs) {
      await fs.ensureDir(dir);
    }
    
    const files = [
      { name: 'LOGOAHQ.png', type: 'logo' },
      { name: 'imagem usina 1a.png', type: 'background' }
    ];

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      
      // Copy to each target directory
      for (const targetDir of targetDirs) {
        const targetPath = path.join(targetDir, file.name);
        await fs.copy(sourcePath, targetPath);
        console.log(`Copied ${file.type} to ${targetPath}`);
      }
    }
    
    console.log('Assets copied successfully');
  } catch (error) {
    console.error('Error copying assets:', error);
    process.exit(1);
  }
}

copyAssets();