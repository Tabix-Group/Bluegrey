import pool from '../models/db.js';
import Usuarios from '../models/usuarios.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const result = await Usuarios.getAll({ search, page: Number(page), limit: Number(limit) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuarios.getById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const nuevoUsuario = await Usuarios.create({ nombre, email, password, rol });
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuarioActualizado = await Usuarios.update(req.params.id, { nombre, email, password, rol });
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    await Usuarios.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// ...existing code...
