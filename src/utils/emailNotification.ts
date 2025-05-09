import axios from 'axios';

const EMAIL_ENDPOINTS = {
  development: 'http://localhost:8080/ahq/api/notifications/email',
  production: 'https://api.ahq.com.br/notifications/email'
};

export const sendMermaidUpdates = async (mermaidContent: string) => {
  console.log('Iniciando envio de notificação do Mermaid');
  
  const recipients = [
    'eng.gustavo90lima@gmail.com',
    'luis.gustavo@sanasa.com.br'
  ];

  try {
    const endpoint = process.env.NODE_ENV === 'production' 
      ? EMAIL_ENDPOINTS.production 
      : EMAIL_ENDPOINTS.development;

    const response = await axios.post(endpoint, {
      recipients,
      subject: 'Atualização do Diagrama Mermaid - AHQ Platform',
      content: mermaidContent,
      timestamp: new Date().toISOString()
    });

    console.log('Notificação enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    throw error;
  }
}