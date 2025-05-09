const jwt = require('jsonwebtoken');
const axios = require('axios');

const externalSystemConfig = {
  baseUrl: 'http://localhost:8080/ahq',
  clientId: process.env.EXTERNAL_CLIENT_ID,
  clientSecret: process.env.EXTERNAL_CLIENT_SECRET
};

async function handleExternalAuth(token) {
  try {
    const response = await axios.post(`${externalSystemConfig.baseUrl}/auth/validate`, {
      token,
      clientId: externalSystemConfig.clientId
    });
    return response.data;
  } catch (error) {
    console.error('External auth error:', error);
    throw error;
  }
}

module.exports = {
  handleExternalAuth,
  externalSystemConfig
};