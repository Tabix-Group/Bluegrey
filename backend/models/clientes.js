import pool from './db.js';


export const getAllClientes = async () => {
  const { rows } = await pool.query('SELECT id, nombre, direccion, categoria FROM clientes');
  return rows;
};


export const getClienteById = async (id) => {
  const { rows } = await pool.query('SELECT id, nombre, direccion, categoria FROM clientes WHERE id = $1', [id]);
  return rows[0];
};


export const createCliente = async (cliente) => {
  const { nombre, direccion, categoria } = cliente;
  const { rows } = await pool.query(
    'INSERT INTO clientes (nombre, direccion, categoria) VALUES ($1, $2, $3) RETURNING id, nombre, direccion, categoria',
    [nombre, direccion, categoria]
  );
  return rows[0];
};


export const updateCliente = async (id, cliente) => {
  const { nombre, direccion, categoria } = cliente;
  const { rows } = await pool.query(
    'UPDATE clientes SET nombre = $1, direccion = $2, categoria = $3 WHERE id = $4 RETURNING id, nombre, direccion, categoria',
    [nombre, direccion, categoria, id]
  );
  return rows[0];
};

export const deleteCliente = async (id) => {
  await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
};
