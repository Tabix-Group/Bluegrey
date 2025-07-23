import pool from './db.js';

export const getAllEntregas = async () => {
  const { rows } = await pool.query('SELECT * FROM entregas');
  return rows;
};

export const getEntregaById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM entregas WHERE id = $1', [id]);
  return rows[0];
};

export const createEntrega = async (entrega) => {
  const { cronograma_id, fecha_entrega, producto_id, estado } = entrega;
  const { rows } = await pool.query(
    'INSERT INTO entregas (cronograma_id, fecha_entrega, producto_id, estado) VALUES ($1, $2, $3, $4) RETURNING *',
    [cronograma_id, fecha_entrega, producto_id, estado]
  );
  return rows[0];
};

export const updateEntrega = async (id, entrega) => {
  const { cronograma_id, fecha_entrega, producto_id, estado } = entrega;
  const { rows } = await pool.query(
    'UPDATE entregas SET cronograma_id = $1, fecha_entrega = $2, producto_id = $3, estado = $4 WHERE id = $5 RETURNING *',
    [cronograma_id, fecha_entrega, producto_id, estado, id]
  );
  return rows[0];
};

export const deleteEntrega = async (id) => {
  await pool.query('DELETE FROM entregas WHERE id = $1', [id]);
};
