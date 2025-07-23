

import React, { useEffect, useState } from 'react';
import { getModelosMensaje, createModeloMensaje, deleteModeloMensaje, updateModeloMensaje } from '../services/modelosMensajeService';
import CustomModal from '../components/CustomModal';

export default function ModelosMensajePage() {
  const [modelos, setModelos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ categoria: '', texto_base: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarModelos();
  }, []);

  async function cargarModelos() {
    setModelos(await getModelosMensaje());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ categoria: '', texto_base: '' });
    setModalOpen(true);
  }

  function openEditModal(modelo) {
    setEditId(modelo.id);
    setForm({
      categoria: modelo.categoria || '',
      texto_base: modelo.texto_base || ''
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ categoria: '', texto_base: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await updateModeloMensaje(editId, form);
    } else {
      await createModeloMensaje(form);
    }
    closeModal();
    cargarModelos();
  }

  async function handleDelete(id) {
    await deleteModeloMensaje(id);
    cargarModelos();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Modelos de Mensaje</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Agregar modelo
        </button>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar modelo' : 'Agregar modelo'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={inputStyle} />
          <input required placeholder="Texto base" value={form.texto_base} onChange={e => setForm(f => ({ ...f, texto_base: e.target.value }))} style={inputStyle} />
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
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Texto base</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modelos.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{m.id}</td>
                <td style={tdStyle}>{m.categoria}</td>
                <td style={tdStyle}>{m.texto_base}</td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(m)} style={editBtnStyle}>Editar</button>{' '}
                  <button onClick={() => handleDelete(m.id)} style={deleteBtnStyle}>Eliminar</button>
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
