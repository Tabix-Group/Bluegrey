

import React, { useEffect, useState } from 'react';
import { getContactos, createContacto, deleteContacto, updateContacto } from '../services/contactosService';
import CustomModal from '../components/CustomModal';

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    setContactos(await getContactos());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
    setModalOpen(true);
  }

  function openEditModal(contacto) {
    setEditId(contacto.id);
    setForm({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      email: contacto.email || '',
      cliente_id: contacto.cliente_id || '',
      otros_datos: contacto.otros_datos ? JSON.stringify(contacto.otros_datos) : ''
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cliente_id: Number(form.cliente_id), otros_datos: form.otros_datos ? JSON.parse(form.otros_datos) : null };
    if (editId) {
      await updateContacto(editId, data);
    } else {
      await createContacto(data);
    }
    closeModal();
    cargarContactos();
  }

  async function handleDelete(id) {
    await deleteContacto(id);
    cargarContactos();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Contactos</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Agregar contacto
        </button>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar contacto' : 'Agregar contacto'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <input required placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={inputStyle} />
          <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
          <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} style={inputStyle} />
          <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} style={inputStyle} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={submitBtnStyle}>{editId ? 'Actualizar' : 'Agregar'}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle}>Cancelar</button>
          </div>
        </form>
      </CustomModal>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Cliente ID</th>
              <th style={thStyle}>Otros datos</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.nombre}</td>
                <td style={tdStyle}>{c.telefono}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{c.cliente_id}</td>
                <td style={tdStyle}><pre style={{ margin: 0, fontSize: 13 }}>{c.otros_datos ? JSON.stringify(c.otros_datos) : ''}</pre></td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(c)} style={editBtnStyle}>Editar</button>{' '}
                  <button onClick={() => handleDelete(c.id)} style={deleteBtnStyle}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 15
};
const submitBtnStyle = {
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};
const cancelBtnStyle = {
  background: '#eee',
  color: '#333',
  border: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer'
};
const editBtnStyle = {
  background: '#ffc107',
  color: '#222',
  border: 'none',
  borderRadius: 8,
  padding: '7px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  marginRight: 6
};
const deleteBtnStyle = {
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '7px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer'
};
const thStyle = { padding: '10px 8px', fontWeight: 700, background: '#f7f7f7', borderBottom: '2px solid #eee' };
const tdStyle = { padding: '8px 8px', borderBottom: '1px solid #eee', textAlign: 'left' };
