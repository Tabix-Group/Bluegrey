

// Estilos únicos (deben estar antes del componente para estar disponibles)
import React, { useState, useEffect } from 'react';

const pageBtnStyle = { background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' };
import CustomModal from '../components/CustomModal';
import { getEntregas, createEntrega, deleteEntrega, updateEntrega } from '../services/entregasService';



export default function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarEntregas();
  }, []);

  async function cargarEntregas() {
    setEntregas(await getEntregas());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
    setFormError('');
    setFormSuccess('');
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
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.cronograma_id.trim() || isNaN(Number(form.cronograma_id))) return 'Cronograma ID es obligatorio y debe ser numérico.';
    if (!form.fecha_entrega.trim()) return 'La fecha de entrega es obligatoria.';
    if (!form.producto_id.trim() || isNaN(Number(form.producto_id))) return 'Producto ID es obligatorio y debe ser numérico.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    setLoading(true);
    try {
      const data = { ...form, cronograma_id: Number(form.cronograma_id), producto_id: Number(form.producto_id) };
      if (editId) {
        await updateEntrega(editId, data);
        setFormSuccess('Entrega actualizada correctamente.');
      } else {
        await createEntrega(data);
        setFormSuccess('Entrega agregada correctamente.');
      }
      cargarEntregas();
      setTimeout(() => { closeModal(); }, 900);
    } catch (err) {
      setFormError('Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    try {
      await deleteEntrega(id);
      setFormSuccess('Entrega eliminada.');
      cargarEntregas();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = entregas.filter(e =>
    String(e.cronograma_id).includes(search) ||
    String(e.producto_id).includes(search) ||
    (e.estado && e.estado.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 1100, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Entregas</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          title="Agregar una nueva entrega"
          aria-label="Agregar una nueva entrega"
          tabIndex={0}
        >
          Agregar entrega
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Buscar por cronograma ID, producto ID o estado..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, width: 320 }}
          title="Buscar entregas"
          aria-label="Buscar entregas"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar entrega' : 'Agregar entrega'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }} aria-label="Formulario de entrega">
          {formError && <div style={{ color: '#dc3545', background: '#fff0f0', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formError}</div>}
          {formSuccess && <div style={{ color: '#28a745', background: '#eafbe7', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formSuccess}</div>}
          <input required placeholder="Cronograma ID" value={form.cronograma_id} onChange={e => setForm(f => ({ ...f, cronograma_id: e.target.value }))} style={inputStyle} title="ID del cronograma asociado" aria-label="ID del cronograma asociado" tabIndex={0} />
          <input required type="date" placeholder="Fecha de entrega" value={form.fecha_entrega} onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))} style={inputStyle} title="Fecha de la entrega" aria-label="Fecha de la entrega" tabIndex={0} />
          <input required placeholder="Producto ID" value={form.producto_id} onChange={e => setForm(f => ({ ...f, producto_id: e.target.value }))} style={inputStyle} title="ID del producto entregado" aria-label="ID del producto entregado" tabIndex={0} />
          <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} style={inputStyle} title="Estado de la entrega" aria-label="Estado de la entrega" tabIndex={0}>
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={{...submitBtnStyle, background:'#0056b3'}} disabled={loading} title={editId ? 'Actualizar entrega' : 'Agregar entrega'} aria-label={editId ? 'Actualizar entrega' : 'Agregar entrega'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader" style={{ border: '3px solid #eee', borderTop: '3px solid #007bff', borderRadius: '50%', width: 22, height: 22, display: 'inline-block', animation: 'spin 1s linear infinite' }}></span></div>}
        </form>
      </CustomModal>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }} role="table" aria-label="Tabla de entregas">
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={thStyle} scope="col">ID</th>
              <th style={thStyle} scope="col">Cronograma ID</th>
              <th style={thStyle} scope="col">Fecha entrega</th>
              <th style={thStyle} scope="col">Producto ID</th>
              <th style={thStyle} scope="col">Estado</th>
              <th style={thStyle} scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#888', fontSize: 16, padding: 24 }}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paged.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                  <td style={tdStyle}>{e.id}</td>
                  <td style={tdStyle}>{e.cronograma_id}</td>
                  <td style={tdStyle}>{e.fecha_entrega ? e.fecha_entrega.slice(0, 10) : ''}</td>
                  <td style={tdStyle}>{e.producto_id}</td>
                  <td style={tdStyle}>{e.estado}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openEditModal(e)} style={editBtnStyle} disabled={loading} title="Editar entrega" aria-label="Editar entrega" tabIndex={0}>Editar</button>{' '}
                    <button onClick={() => handleDelete(e.id)} style={deleteBtnStyle} disabled={loading} title="Eliminar entrega" aria-label="Eliminar entrega" tabIndex={0}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle} title="Página anterior" aria-label="Página anterior" tabIndex={0}>&lt;</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtnStyle} title="Página siguiente" aria-label="Página siguiente" tabIndex={0}>&gt;</button>
        </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
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
