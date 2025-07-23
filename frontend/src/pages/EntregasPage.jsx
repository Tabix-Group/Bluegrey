

import React, { useEffect, useState } from 'react';
import { getEntregas, createEntrega, deleteEntrega, updateEntrega } from '../services/entregasService';
import CustomModal from '../components/CustomModal';

export default function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarEntregas();
  }, []);

  async function cargarEntregas() {
    setEntregas(await getEntregas());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
    setModalOpen(true);
  }

  function openEditModal(entrega) {
    setEditId(entrega.id);
    setForm({
      cronograma_id: entrega.cronograma_id || '',
      fecha_entrega: entrega.fecha_entrega ? entrega.fecha_entrega.slice(0, 10) : '',
      producto_id: entrega.producto_id || '',
      estado: entrega.estado || 'pendiente'
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cronograma_id: Number(form.cronograma_id), producto_id: Number(form.producto_id) };
    if (editId) {
      await updateEntrega(editId, data);
    } else {
      await createEntrega(data);
    }
    closeModal();
    cargarEntregas();
  }

  async function handleDelete(id) {
    await deleteEntrega(id);
    cargarEntregas();
  }

  return (
    <div style={{ maxWidth: 1100, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Entregas</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Agregar entrega
        </button>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar entrega' : 'Agregar entrega'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Cronograma ID" value={form.cronograma_id} onChange={e => setForm(f => ({ ...f, cronograma_id: e.target.value }))} style={inputStyle} />
          <input required type="date" placeholder="Fecha entrega" value={form.fecha_entrega} onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))} style={inputStyle} />
          <input required placeholder="Producto ID" value={form.producto_id} onChange={e => setForm(f => ({ ...f, producto_id: e.target.value }))} style={inputStyle} />
          <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} style={inputStyle}>
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
          </select>
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
              <th style={thStyle}>Cronograma ID</th>
              <th style={thStyle}>Fecha entrega</th>
              <th style={thStyle}>Producto ID</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{e.id}</td>
                <td style={tdStyle}>{e.cronograma_id}</td>
                <td style={tdStyle}>{e.fecha_entrega ? e.fecha_entrega.slice(0, 10) : ''}</td>
                <td style={tdStyle}>{e.producto_id}</td>
                <td style={tdStyle}>{e.estado}</td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(e)} style={editBtnStyle}>Editar</button>{' '}
                  <button onClick={() => handleDelete(e.id)} style={deleteBtnStyle}>Eliminar</button>
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
