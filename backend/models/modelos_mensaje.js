import pool from './db.js';

export const getAllModelosMensaje = async () => {
  const { rows } = await pool.query('SELECT * FROM modelos_mensaje');
  return rows;
};

export const getModeloMensajeById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM modelos_mensaje WHERE id = $1', [id]);
  return rows[0];
};

export const createModeloMensaje = async (modelo) => {
  const { categoria, texto_base } = modelo;
  const { rows } = await pool.query(
    'INSERT INTO modelos_mensaje (categoria, texto_base) VALUES ($1, $2) RETURNING *',
    [categoria, texto_base]
  );
  return rows[0];
};


export const updateModeloMensaje = async (id, modelo) => {
  const { categoria, texto_base } = modelo;
  const { rows } = await pool.query(
    'UPDATE modelos_mensaje SET categoria = $1, texto_base = $2 WHERE id = $3 RETURNING *',
    [categoria, texto_base, id]
  );
  return rows[0];
};



export const deleteModeloMensaje = async (id) => {
  await pool.query('DELETE FROM modelos_mensaje WHERE id = $1', [id]);
};
