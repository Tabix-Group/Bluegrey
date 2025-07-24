

import React, { useEffect, useState } from 'react';
import { getClientes, createCliente, deleteCliente, updateCliente } from '../services/clientesService';
import CustomModal from '../components/CustomModal';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', direccion: '', categoria: '' });
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
    setForm({ nombre: '', direccion: '', categoria: '' });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(cliente) {
    setEditId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      categoria: cliente.categoria || ''
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', direccion: '', categoria: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    // otros_datos removed
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
      const data = { ...form };
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
    <div className="app-content card">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Clientes</h2>
        <button className="btn" onClick={openAddModal} title="Agregar un nuevo cliente" aria-label="Agregar un nuevo cliente" tabIndex={0}>
          Agregar cliente
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          className=""
          type="text"
          placeholder="Buscar por nombre, dirección o categoría..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar clientes"
          aria-label="Buscar clientes"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar cliente' : 'Agregar cliente'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de cliente">
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} title="Nombre del cliente" aria-label="Nombre del cliente" tabIndex={0} />
          <input placeholder="Dirección" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} title="Dirección del cliente" aria-label="Dirección del cliente" tabIndex={0} />
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} title="Categoría del cliente" aria-label="Categoría del cliente" tabIndex={0} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" disabled={loading} title={editId ? 'Actualizar cliente' : 'Agregar cliente'} aria-label={editId ? 'Actualizar cliente' : 'Agregar cliente'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" className="btn" onClick={closeModal} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de clientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#888', fontSize: 16, padding: 24 }}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paged.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.direccion}</td>
                  <td>{c.categoria}</td>
                  <td>
                    <button className="btn" onClick={() => openEditModal(c)} disabled={loading} title="Editar cliente" aria-label="Editar cliente" tabIndex={0} style={{ marginRight: 8, background: '#ffc107', color: '#333' }}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(c.id)} disabled={loading} title="Eliminar cliente" aria-label="Eliminar cliente" tabIndex={0} style={{ background: '#dc3545', color: '#fff' }}>Eliminar</button>
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


