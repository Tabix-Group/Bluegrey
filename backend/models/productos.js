import pool from './db.js';

export const getAllProductos = async () => {
  const { rows } = await pool.query('SELECT * FROM productos');
  return rows;
};

export const getProductoById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  return rows[0];
};

export const createProducto = async (producto) => {
  const { nombre, descripcion, categoria, precio } = producto;
  const { rows } = await pool.query(
    'INSERT INTO productos (nombre, descripcion, categoria, precio) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, descripcion, categoria, precio]
  );
  return rows[0];
};

export const updateProducto = async (id, producto) => {
  const { nombre, descripcion, categoria, precio } = producto;
  const { rows } = await pool.query(
    'UPDATE productos SET nombre = $1, descripcion = $2, categoria = $3, precio = $4 WHERE id = $5 RETURNING *',
    [nombre, descripcion, categoria, precio, id]
  );
  return rows[0];
};

export const deleteProducto = async (id) => {
  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
};
