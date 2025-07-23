

// Estilos únicos (deben estar antes del componente para estar disponibles)
import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import { getCronogramas, createCronograma, deleteCronograma, updateCronograma } from '../services/cronogramasService';


const pageBtnStyle = { background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' };

export default function CronogramasPage() {
  const [cronogramas, setCronogramas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarCronogramas();
  }, []);

  async function cargarCronogramas() {
    setCronogramas(await getCronogramas());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    setFormError('');
    setFormSuccess('');
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
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.cliente_id.trim() || isNaN(Number(form.cliente_id))) return 'Cliente ID es obligatorio y debe ser numérico.';
    if (!form.fecha_inicio.trim()) return 'La fecha de inicio es obligatoria.';
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
      const data = { ...form, cliente_id: Number(form.cliente_id), activo: Boolean(form.activo) };
      if (editId) {
        await updateCronograma(editId, data);
        setFormSuccess('Cronograma actualizado correctamente.');
      } else {
        await createCronograma(data);
        setFormSuccess('Cronograma agregado correctamente.');
      }
      cargarCronogramas();
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
      await deleteCronograma(id);
      setFormSuccess('Cronograma eliminado.');
      cargarCronogramas();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = cronogramas.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase())) ||
    (c.cliente_id && String(c.cliente_id).includes(search))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 1100, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Cronogramas</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          title="Agregar un nuevo cronograma"
        >
          Agregar cronograma
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o cliente ID..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, width: 320 }}
          title="Buscar cronogramas"
          aria-label="Buscar cronogramas"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar cronograma' : 'Agregar cronograma'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }} aria-label="Formulario de cronograma">
          {formError && <div style={{ color: '#dc3545', background: '#fff0f0', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formError}</div>}
          {formSuccess && <div style={{ color: '#28a745', background: '#eafbe7', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} title="Nombre del cronograma" aria-label="Nombre del cronograma" tabIndex={0} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={inputStyle} title="Descripción del cronograma" aria-label="Descripción del cronograma" tabIndex={0} />
          <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} style={inputStyle} title="ID del cliente asociado" aria-label="ID del cliente asociado" tabIndex={0} />
          <input required type="date" placeholder="Fecha de inicio" value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} style={inputStyle} title="Fecha de inicio" aria-label="Fecha de inicio" tabIndex={0} />
          <select value={form.recurrencia} onChange={e => setForm(f => ({ ...f, recurrencia: e.target.value }))} style={inputStyle} title="Recurrencia" aria-label="Recurrencia" tabIndex={0}>
            <option value="diaria">Diaria</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }} title="¿Está activo?" aria-label="¿Está activo?">
            <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} tabIndex={0} /> Activo
          </label>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={{...submitBtnStyle, background:'#0056b3'}} disabled={loading} title={editId ? 'Actualizar cronograma' : 'Agregar cronograma'} aria-label={editId ? 'Actualizar cronograma' : 'Agregar cronograma'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader" style={{ border: '3px solid #eee', borderTop: '3px solid #007bff', borderRadius: '50%', width: 22, height: 22, display: 'inline-block', animation: 'spin 1s linear infinite' }}></span></div>}
        </form>
      </CustomModal>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }} role="table" aria-label="Tabla de cronogramas">
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={thStyle} scope="col">ID</th>
              <th style={thStyle} scope="col">Nombre</th>
              <th style={thStyle} scope="col">Descripción</th>
              <th style={thStyle} scope="col">Cliente ID</th>
              <th style={thStyle} scope="col">Fecha inicio</th>
              <th style={thStyle} scope="col">Recurrencia</th>
              <th style={thStyle} scope="col">Activo</th>
              <th style={thStyle} scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#888', fontSize: 16, padding: 24 }}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paged.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                  <td style={tdStyle}>{c.id}</td>
                  <td style={tdStyle}>{c.nombre}</td>
                  <td style={tdStyle}>{c.descripcion}</td>
                  <td style={tdStyle}>{c.cliente_id}</td>
                  <td style={tdStyle}>{c.fecha_inicio ? c.fecha_inicio.slice(0, 10) : ''}</td>
                  <td style={tdStyle}>{c.recurrencia}</td>
                  <td style={tdStyle}>{c.activo ? 'Sí' : 'No'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openEditModal(c)} style={editBtnStyle} disabled={loading} title="Editar cronograma" aria-label="Editar cronograma" tabIndex={0}>Editar</button>{' '}
                    <button onClick={() => handleDelete(c.id)} style={deleteBtnStyle} disabled={loading} title="Eliminar cronograma" aria-label="Eliminar cronograma" tabIndex={0}>Eliminar</button>
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
