// Login de usuario por email y password
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o password' });
    }
    const usuario = await Usuarios.getByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // Comparar password plano (en producción usar hash)
    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // No enviar password en la respuesta
    const { password: _, ...usuarioSafe } = usuario;
    res.json(usuarioSafe);
  } catch (err) {
    res.status(500).json({ error: 'Error al autenticar usuario' });
  }
};
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
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, email, password, rol)' });
    }
    const nuevoUsuario = await Usuarios.create({ nombre, email, password, rol });
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};


export const updateUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, email, password, rol)' });
    }
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
