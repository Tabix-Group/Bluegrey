
import React, { useEffect, useState } from 'react';
import { getContactos, createContacto, deleteContacto, updateContacto } from '../services/contactosService';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    setContactos(await getContactos());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cliente_id: Number(form.cliente_id), otros_datos: form.otros_datos ? JSON.parse(form.otros_datos) : null };
    if (editId) {
      await updateContacto(editId, data);
      setEditId(null);
    } else {
      await createContacto(data);
    }
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
    cargarContactos();
  }

  function handleEdit(contacto) {
    setEditId(contacto.id);
    setForm({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      email: contacto.email || '',
      cliente_id: contacto.cliente_id || '',
      otros_datos: contacto.otros_datos ? JSON.stringify(contacto.otros_datos) : ''
    });
  }

  async function handleDelete(id) {
    await deleteContacto(id);
    cargarContactos();
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Contactos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />{' '}
        <input required placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />{' '}
        <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />{' '}
        <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} />{' '}
        <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} />{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Cliente ID</th><th>Otros datos</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactos.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.telefono}</td>
              <td>{c.email}</td>
              <td>{c.cliente_id}</td>
              <td><pre style={{ margin: 0 }}>{c.otros_datos ? JSON.stringify(c.otros_datos) : ''}</pre></td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>{' '}
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
