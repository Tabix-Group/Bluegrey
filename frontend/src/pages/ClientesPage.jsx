
import React, { useEffect, useState } from 'react';
import { getClientes, createCliente, deleteCliente, updateCliente } from '../services/clientesService';
import CustomModal from '../components/CustomModal';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    setClientes(await getClientes());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(cliente) {
    setEditId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      categoria: cliente.categoria || '',
      otros_datos: cliente.otros_datos ? JSON.stringify(cliente.otros_datos) : ''
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (form.otros_datos) {
      try { JSON.parse(form.otros_datos); } catch { return 'Otros datos debe ser JSON válido.'; }
    }
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
      const data = { ...form, otros_datos: form.otros_datos ? JSON.parse(form.otros_datos) : null };
      if (editId) {
        await updateCliente(editId, data);
        setFormSuccess('Cliente actualizado correctamente.');
      } else {
        await createCliente(data);
        setFormSuccess('Cliente agregado correctamente.');
      }
      cargarClientes();
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
      await deleteCliente(id);
      setFormSuccess('Cliente eliminado.');
      cargarClientes();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.direccion && c.direccion.toLowerCase().includes(search.toLowerCase())) ||
    (c.categoria && c.categoria.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Clientes</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          title="Agregar un nuevo cliente"
        >
          Agregar cliente
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o categoría..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, width: 320 }}
          title="Buscar clientes"
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar cliente' : 'Agregar cliente'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {formError && <div style={{ color: '#dc3545', background: '#fff0f0', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formError}</div>}
          {formSuccess && <div style={{ color: '#28a745', background: '#eafbe7', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} title="Nombre del cliente" />
          <input placeholder="Dirección" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={inputStyle} title="Dirección del cliente" />
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={inputStyle} title="Categoría del cliente" />
          <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} style={inputStyle} title="Otros datos en formato JSON" />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={submitBtnStyle} disabled={loading}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle} disabled={loading}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader" style={{ border: '3px solid #eee', borderTop: '3px solid #007bff', borderRadius: '50%', width: 22, height: 22, display: 'inline-block', animation: 'spin 1s linear infinite' }}></span></div>}
        </form>
      </CustomModal>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Otros datos</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.nombre}</td>
                <td style={tdStyle}>{c.direccion}</td>
                <td style={tdStyle}>{c.categoria}</td>
                <td style={tdStyle}><pre style={{ margin: 0, fontSize: 13 }}>{c.otros_datos ? JSON.stringify(c.otros_datos, null, 2) : ''}</pre></td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(c)} style={editBtnStyle} disabled={loading} title="Editar cliente">Editar</button>{' '}
                  <button onClick={() => handleDelete(c.id)} style={deleteBtnStyle} disabled={loading} title="Eliminar cliente">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle} title="Página anterior">&lt;</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtnStyle} title="Página siguiente">&gt;</button>
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
const pageBtnStyle = { background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' };
