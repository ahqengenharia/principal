const fs = require('fs');
const path = require('path');

const configureGLPI = async (config) => {
  try {
    // Path to GLPI config file
    const glpiConfigPath = path.join(process.env.GLPI_PATH, 'config', 'config_db.php');
    
    // Custom CSS for AHQ branding
    const customCSS = `
      .glpi-header {
        background: #fff;
        padding: 10px;
      }
      .client-logo {
        max-height: 50px;
        margin-right: 15px;
      }
      .ahq-logo {
        max-height: 40px;
      }
      .client-info {
        font-size: 14px;
        color: #333;
      }
    `;

    // Write custom CSS
    await fs.promises.writeFile(
      path.join(process.env.GLPI_PATH, 'css', 'custom.css'),
      customCSS
    );

    console.log('GLPI customization completed');
    return true;
  } catch (error) {
    console.error('Error configuring GLPI:', error);
    throw error;
  }
};

module.exports = {
  configureGLPI
};