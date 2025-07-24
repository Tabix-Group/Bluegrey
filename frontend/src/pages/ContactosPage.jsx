

import React, { useEffect, useState } from 'react';
import { getContactos, createContacto, deleteContacto, updateContacto } from '../services/contactosService';
import { getClientes } from '../services/clientesService';
import CustomModal from '../components/CustomModal';

export default function ContactosPage() {
  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.telefono.trim()) return 'El teléfono es obligatorio.';
    if (!form.email.trim()) return 'El email es obligatorio.';
    if (!form.cliente_id) return 'Debe seleccionar un cliente.';
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
  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }
  const [contactos, setContactos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', cliente_id: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clientes, setClientes] = useState([]);
  const pageSize = 8;

  useEffect(() => {
    cargarContactos();
    cargarClientes();
  }, []);

  async function cargarContactos() {
    setContactos(await getContactos());
  }
  async function cargarClientes() {
    setClientes(await getClientes());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '' });
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
      cliente_id: contacto.cliente_id || ''
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  // Búsqueda y paginación
  const filtered = contactos.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono && c.telefono.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ...el resto del componente, renderizado y lógica...
  return (
    <div className="app-content card">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Contactos</h2>
        <button className="btn" onClick={openAddModal} title="Agregar un nuevo contacto" aria-label="Agregar un nuevo contacto" tabIndex={0}>
          Agregar contacto
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          className=""
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar contactos"
          aria-label="Buscar contactos"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar contacto' : 'Agregar contacto'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de contacto">
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} title="Nombre del contacto" aria-label="Nombre del contacto" tabIndex={0} />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} title="Teléfono del contacto" aria-label="Teléfono del contacto" tabIndex={0} />
          <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} title="Email del contacto" aria-label="Email del contacto" tabIndex={0} />
          <select value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} title="Cliente" aria-label="Cliente" tabIndex={0}>
            <option value="">Seleccionar cliente</option>
            {clientes.map(cl => <option key={cl.id} value={cl.id}>{cl.nombre}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" disabled={loading} title={editId ? 'Actualizar contacto' : 'Agregar contacto'} aria-label={editId ? 'Actualizar contacto' : 'Agregar contacto'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" className="btn" onClick={closeModal} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de contactos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Cliente</th>
              <th>Acciones</th>
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
              paged.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.telefono}</td>
                  <td>{c.email}</td>
                  <td>{clientes.find(cl => cl.id === c.cliente_id)?.nombre || ''}</td>
                  <td>
                    <button className="btn" onClick={() => openEditModal(c)} disabled={loading} title="Editar contacto" aria-label="Editar contacto" tabIndex={0}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(c.id)} disabled={loading} title="Eliminar contacto" aria-label="Eliminar contacto" tabIndex={0}>Eliminar</button>
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





