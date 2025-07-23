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

// Crear usuario
exports.createUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email',
      [nombre, apellido, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: 'Nombre, apellido y email son obligatorios' });
  }
  try {
    let query = 'UPDATE usuarios SET nombre=$1, apellido=$2, email=$3';
    let params = [nombre, apellido, email];
    if (password) {
      query += ', password=$4';
      params.push(password);
    }
    query += ' WHERE id=$5 RETURNING id, nombre, apellido, email';
    params.push(id);
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
