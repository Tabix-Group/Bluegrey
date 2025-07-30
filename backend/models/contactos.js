export const getPrimerContactoByClienteId = async (cliente_id) => {
  const { rows } = await pool.query('SELECT * FROM contactos WHERE cliente_id = $1 ORDER BY id ASC LIMIT 1', [cliente_id]);
  return rows[0];
};
import pool from './db.js';

export const getAllContactos = async () => {
  const { rows } = await pool.query('SELECT * FROM contactos');
  return rows;
};

export const getContactoById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM contactos WHERE id = $1', [id]);
  return rows[0];
};


export const createContacto = async (contacto) => {
  const { nombre, telefono, email, cliente_id } = contacto;
  const { rows } = await pool.query(
    'INSERT INTO contactos (nombre, telefono, email, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, telefono, email, cliente_id]
  );
  return rows[0];
};


export const updateContacto = async (id, contacto) => {
  const { nombre, telefono, email, cliente_id } = contacto;
  const { rows } = await pool.query(
    'UPDATE contactos SET nombre = $1, telefono = $2, email = $3, cliente_id = $4 WHERE id = $5 RETURNING *',
    [nombre, telefono, email, cliente_id, id]
  );
  return rows[0];
};

export const deleteContacto = async (id) => {
  await pool.query('DELETE FROM contactos WHERE id = $1', [id]);
};
