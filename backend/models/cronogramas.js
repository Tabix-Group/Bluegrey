import pool from './db.js';

export const getAllCronogramas = async () => {
  const { rows } = await pool.query('SELECT * FROM cronogramas');
  return rows;
};

export const getCronogramaById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM cronogramas WHERE id = $1', [id]);
  return rows[0];
};

export const createCronograma = async (cronograma) => {
  const { nombre, descripcion, cliente_id, fecha_inicio, recurrencia, activo } = cronograma;
  const { rows } = await pool.query(
    'INSERT INTO cronogramas (nombre, descripcion, cliente_id, fecha_inicio, recurrencia, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, descripcion, cliente_id, fecha_inicio, recurrencia, activo]
  );
  return rows[0];
};

export const updateCronograma = async (id, cronograma) => {
  const { nombre, descripcion, cliente_id, fecha_inicio, recurrencia, activo } = cronograma;
  const { rows } = await pool.query(
    'UPDATE cronogramas SET nombre = $1, descripcion = $2, cliente_id = $3, fecha_inicio = $4, recurrencia = $5, activo = $6 WHERE id = $7 RETURNING *',
    [nombre, descripcion, cliente_id, fecha_inicio, recurrencia, activo, id]
  );
  return rows[0];
};

export const deleteCronograma = async (id) => {
  await pool.query('DELETE FROM cronogramas WHERE id = $1', [id]);
};
