import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchClientData = async () => {
  const url = `${API_URL}/client/data`;
  console.log('Buscando dados do cliente de:', url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log('Resposta recebida:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Erro ao buscar dados do cliente:', error);
    // Retornar dados mockados em caso de erro
    return {
      razao_social: "NOME DA UHE",
      grupo: "NOME DO GRUPO DO CLIENTE",
      responsavel_tecnico: "Responsável Técnico"
    };
  }
};