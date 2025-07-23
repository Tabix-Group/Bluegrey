import pool from './db.js';

export const getAllClientes = async () => {
  const { rows } = await pool.query('SELECT * FROM clientes');
  return rows;
};

export const getClienteById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
  return rows[0];
};

export const createCliente = async (cliente) => {
  const { nombre, direccion, categoria, otros_datos } = cliente;
  const { rows } = await pool.query(
    'INSERT INTO clientes (nombre, direccion, categoria, otros_datos) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, direccion, categoria, otros_datos]
  );
  return rows[0];
};

export const updateCliente = async (id, cliente) => {
  const { nombre, direccion, categoria, otros_datos } = cliente;
  const { rows } = await pool.query(
    'UPDATE clientes SET nombre = $1, direccion = $2, categoria = $3, otros_datos = $4 WHERE id = $5 RETURNING *',
    [nombre, direccion, categoria, otros_datos, id]
  );
  return rows[0];
};

export const deleteCliente = async (id) => {
  await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
};
