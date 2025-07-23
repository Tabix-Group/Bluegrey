import axios from 'axios';

const API_URL = '/api/usuarios';

export const getUsuarios = async (search = '', page = 1, limit = 10) => {
  const { data } = await axios.get(API_URL, { params: { search, page, limit } });
  return data;
};

export const getUsuarioById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createUsuario = async (usuario) => {
  const { data } = await axios.post(API_URL, usuario);
  return data;
};

export const updateUsuario = async (id, usuario) => {
  const { data } = await axios.put(`${API_URL}/${id}`, usuario);
  return data;
};

export const deleteUsuario = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
