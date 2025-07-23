

import React, { useEffect, useState } from 'react';
import { getCronogramas, createCronograma, deleteCronograma, updateCronograma } from '../services/cronogramasService';
import CustomModal from '../components/CustomModal';

export default function CronogramasPage() {
  const [cronogramas, setCronogramas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarCronogramas();
  }, []);

  async function cargarCronogramas() {
    setCronogramas(await getCronogramas());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    setModalOpen(true);
  }

  function openEditModal(cronograma) {
    setEditId(cronograma.id);
    setForm({
      nombre: cronograma.nombre,
      descripcion: cronograma.descripcion || '',
      cliente_id: cronograma.cliente_id || '',
      fecha_inicio: cronograma.fecha_inicio ? cronograma.fecha_inicio.slice(0, 10) : '',
      recurrencia: cronograma.recurrencia || 'diaria',
      activo: cronograma.activo
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cliente_id: Number(form.cliente_id), activo: Boolean(form.activo) };
    if (editId) {
      await updateCronograma(editId, data);
    } else {
      await createCronograma(data);
    }
    closeModal();
    cargarCronogramas();
  }

  async function handleDelete(id) {
    await deleteCronograma(id);
    cargarCronogramas();
  }

  return (
    <div style={{ maxWidth: 1100, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Cronogramas</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Agregar cronograma
        </button>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar cronograma' : 'Agregar cronograma'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={inputStyle} />
          <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} style={inputStyle} />
          <input required type="date" placeholder="Fecha inicio" value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} style={inputStyle} />
          <select value={form.recurrencia} onChange={e => setForm(f => ({ ...f, recurrencia: e.target.value }))} style={inputStyle}>
            <option value="diaria">Diaria</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} /> Activo
          </label>
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
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Cliente ID</th>
              <th style={thStyle}>Fecha inicio</th>
              <th style={thStyle}>Recurrencia</th>
              <th style={thStyle}>Activo</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cronogramas.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.nombre}</td>
                <td style={tdStyle}>{c.descripcion}</td>
                <td style={tdStyle}>{c.cliente_id}</td>
                <td style={tdStyle}>{c.fecha_inicio ? c.fecha_inicio.slice(0, 10) : ''}</td>
                <td style={tdStyle}>{c.recurrencia}</td>
                <td style={tdStyle}>{c.activo ? 'Sí' : 'No'}</td>
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
