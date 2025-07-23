

import React, { useEffect, useState } from 'react';
import { getContactos, createContacto, deleteContacto, updateContacto } from '../services/contactosService';
import CustomModal from '../components/CustomModal';
// Estilos únicos (deben estar antes del componente para estar disponibles)
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

export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarContactos();
  }, []);

  async function cargarContactos() {
    setContactos(await getContactos());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
    setFormError('');
    setFormSuccess('');
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
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '', otros_datos: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.telefono.trim()) return 'El teléfono es obligatorio.';
    if (!form.cliente_id.trim() || isNaN(Number(form.cliente_id))) return 'Cliente ID es obligatorio y debe ser numérico.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'El email no es válido.';
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
      const data = { ...form, cliente_id: Number(form.cliente_id), otros_datos: form.otros_datos ? JSON.parse(form.otros_datos) : null };
      if (editId) {
        await updateContacto(editId, data);
        setFormSuccess('Contacto actualizado correctamente.');
      } else {
        await createContacto(data);
        setFormSuccess('Contacto agregado correctamente.');
      }
      cargarContactos();
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
      await deleteContacto(id);
      setFormSuccess('Contacto eliminado.');
      cargarContactos();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = contactos.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono && c.telefono.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.cliente_id && String(c.cliente_id).includes(search))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Contactos</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          title="Agregar un nuevo contacto"
        >
          Agregar contacto
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono, email o cliente ID..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 15, width: 320 }}
          title="Buscar contactos"
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar contacto' : 'Agregar contacto'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {formError && <div style={{ color: '#dc3545', background: '#fff0f0', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formError}</div>}
          {formSuccess && <div style={{ color: '#28a745', background: '#eafbe7', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} title="Nombre del contacto" />
          <input required placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={inputStyle} title="Teléfono del contacto" />
          <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} title="Email del contacto" />
          <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} style={inputStyle} title="ID del cliente asociado" />
          <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} style={inputStyle} title="Otros datos en formato JSON" />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={submitBtnStyle} disabled={loading} title={editId ? 'Actualizar contacto' : 'Agregar contacto'}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle} disabled={loading} title="Cancelar">Cancelar</button>
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
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Cliente ID</th>
              <th style={thStyle}>Otros datos</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.nombre}</td>
                <td style={tdStyle}>{c.telefono}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{c.cliente_id}</td>
                <td style={tdStyle}><pre style={{ margin: 0, fontSize: 13 }}>{c.otros_datos ? JSON.stringify(c.otros_datos, null, 2) : ''}</pre></td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(c)} style={editBtnStyle} disabled={loading} title="Editar contacto">Editar</button>{' '}
                  <button onClick={() => handleDelete(c.id)} style={deleteBtnStyle} disabled={loading} title="Eliminar contacto">Eliminar</button>
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

// Estilos únicos (no duplicar)
// (Eliminados duplicados de estilos, solo queda una definición de cada uno)
