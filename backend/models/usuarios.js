import pool from './db.js';

const Usuarios = {
  async getAll({ search = '', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;
    const totalQuery = 'SELECT COUNT(*) FROM usuarios WHERE nombre ILIKE $1 OR email ILIKE $1';
    const dataQuery = `SELECT * FROM usuarios WHERE nombre ILIKE $1 OR email ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`;
    const totalResult = await pool.query(totalQuery, [searchQuery]);
    const dataResult = await pool.query(dataQuery, [searchQuery, limit, offset]);
    return {
      total: parseInt(totalResult.rows[0].count, 10),
      data: dataResult.rows,
    };
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ nombre, email, password, rol }) {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, password, rol]
    );
    return result.rows[0];
  },

  async update(id, { nombre, email, password, rol }) {
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, password = $3, rol = $4 WHERE id = $5 RETURNING *',
      [nombre, email, password, rol, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return true;
  },
};

export default Usuarios;
