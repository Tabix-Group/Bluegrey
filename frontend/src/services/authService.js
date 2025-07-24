import axios from 'axios';
const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/usuarios';

export const loginUsuario = async (email, password) => {
  const { data } = await axios.post(API_URL + '/login', { email, password });
  return data;
};

// ...otros métodos existentes...
