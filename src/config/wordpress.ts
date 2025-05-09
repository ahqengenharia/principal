import axios from 'axios';

const WP_API_URL = 'https://oceanwp.org/wp-json/wp/v2';
const WP_AUTH = {
  username: 'eng.gustavo90lima@gmail.com',
  password: 'Duda@0905'
};

export const wpClient = axios.create({
  baseURL: WP_API_URL,
  auth: WP_AUTH
});

export const getWPSupport = async () => {
  const response = await wpClient.get('/pages/support');
  return response.data;
};