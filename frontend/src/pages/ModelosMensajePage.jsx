

import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import { getModelosMensaje, createModeloMensaje, deleteModeloMensaje, updateModeloMensaje } from '../services/modelosMensajeService';

export default function ModelosMensajePage() {
  const [modelos, setModelos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ categoria: '', texto_base: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarModelos();
  }, []);

  async function cargarModelos() {
    setModelos(await getModelosMensaje());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ categoria: '', texto_base: '' });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(modelo) {
    setEditId(modelo.id);
    setForm({
      categoria: modelo.categoria || '',
      texto_base: modelo.texto_base || ''
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ categoria: '', texto_base: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.texto_base.trim()) return 'El texto base es obligatorio.';
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
      if (editId) {
        await updateModeloMensaje(editId, form);
        setFormSuccess('Modelo actualizado correctamente.');
      } else {
        await createModeloMensaje(form);
        setFormSuccess('Modelo agregado correctamente.');
      }
      cargarModelos();
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
      await deleteModeloMensaje(id);
      setFormSuccess('Modelo eliminado.');
      cargarModelos();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = modelos.filter(m =>
    (m.categoria && m.categoria.toLowerCase().includes(search.toLowerCase())) ||
    (m.texto_base && m.texto_base.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="app-content card">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Modelos de Mensaje</h2>
        <button className="btn" onClick={openAddModal} title="Agregar un nuevo modelo de mensaje" aria-label="Agregar un nuevo modelo de mensaje" tabIndex={0}>
          Agregar modelo
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          className=""
          type="text"
          placeholder="Buscar por categoría o texto base..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar modelos de mensaje"
          aria-label="Buscar modelos de mensaje"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar modelo' : 'Agregar modelo'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de modelo de mensaje">
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} title="Categoría del modelo" aria-label="Categoría del modelo" tabIndex={0} />
          <input required placeholder="Texto base" value={form.texto_base} onChange={e => setForm(f => ({ ...f, texto_base: e.target.value }))} title="Texto base del mensaje" aria-label="Texto base del mensaje" tabIndex={0} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" disabled={loading} title={editId ? 'Actualizar modelo' : 'Agregar modelo'} aria-label={editId ? 'Actualizar modelo' : 'Agregar modelo'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" className="btn" onClick={closeModal} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de modelos de mensaje">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Texto base</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#888', fontSize: 16, padding: 24 }}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paged.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.categoria}</td>
                  <td>{m.texto_base}</td>
                  <td>
                    <button className="btn" onClick={() => openEditModal(m)} disabled={loading} title="Editar modelo" aria-label="Editar modelo" tabIndex={0} style={{ marginRight: 8, background: '#ffc107', color: '#333' }}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(m.id)} disabled={loading} title="Eliminar modelo" aria-label="Eliminar modelo" tabIndex={0} style={{ background: '#dc3545', color: '#fff' }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} title="Página anterior" aria-label="Página anterior" tabIndex={0}>&lt;</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Página {page} de {totalPages}</span>
          <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} title="Página siguiente" aria-label="Página siguiente" tabIndex={0}>&gt;</button>
        </div>
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
