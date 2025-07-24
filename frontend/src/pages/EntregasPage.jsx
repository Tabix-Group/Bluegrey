

// Estilos únicos (deben estar antes del componente para estar disponibles)

import React, { useState, useEffect } from 'react';

const pageBtnStyle = { background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' };

import CustomModal from '../components/CustomModal';
import { getEntregas, createEntrega, deleteEntrega, updateEntrega } from '../services/entregasService';
import { getProductos } from '../services/productosService';
import { getCronogramas } from '../services/cronogramasService';




export default function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cronogramas, setCronogramas] = useState([]);
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
    cargarProductos();
    cargarCronogramas();
  }, []);

  async function cargarEntregas() {
    setEntregas(await getEntregas());
  }
  async function cargarProductos() {
    setProductos(await getProductos());
  }
  async function cargarCronogramas() {
    setCronogramas(await getCronogramas());
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
    <div className="card card-wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Entregas</h2>
        <button className="btn btn-primary" onClick={openAddModal} title="Agregar una nueva entrega" aria-label="Agregar una nueva entrega" tabIndex={0}>
          Agregar entrega
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por cronograma ID, producto ID o estado..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input"
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
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de entrega">
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          <select required value={form.cronograma_id} onChange={e => setForm(f => ({ ...f, cronograma_id: e.target.value }))} className="input" title="Cronograma asociado" aria-label="Cronograma asociado" tabIndex={0}>
            <option value="">Seleccionar cronograma...</option>
            {cronogramas.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.nombre || c.descripcion || 'Sin nombre'}
              </option>
            ))}
          </select>
          <input required type="date" placeholder="Fecha de entrega" value={form.fecha_entrega} onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))} className="input" title="Fecha de la entrega" aria-label="Fecha de la entrega" tabIndex={0} />
          <select required value={form.producto_id} onChange={e => setForm(f => ({ ...f, producto_id: e.target.value }))} className="input" title="Producto entregado" aria-label="Producto entregado" tabIndex={0}>
            <option value="">Seleccionar producto...</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.nombre || p.descripcion || 'Sin nombre'}
              </option>
            ))}
          </select>
          <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} className="input" title="Estado de la entrega" aria-label="Estado de la entrega" tabIndex={0}>
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
          </select>
          <div className="flex-row gap-12 mt-8">
            <button type="submit" className="btn btn-primary" disabled={loading} title={editId ? 'Actualizar entrega' : 'Agregar entrega'} aria-label={editId ? 'Actualizar entrega' : 'Agregar entrega'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div className="loader-container"><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="table-responsive card-table">
        <table className="table" role="table" aria-label="Tabla de entregas">
          <thead>
            <tr className="table-header">
              <th className="table-cell" scope="col">ID</th>
              <th className="table-cell" scope="col">Cronograma ID</th>
              <th className="table-cell" scope="col">Fecha entrega</th>
              <th className="table-cell" scope="col">Producto ID</th>
              <th className="table-cell" scope="col">Estado</th>
              <th className="table-cell" scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-cell text-center text-muted">No hay resultados para mostrar.</td>
              </tr>
            ) : (
              paged.map(e => (
                <tr key={e.id} className="table-row">
                  <td className="table-cell">{e.id}</td>
                  <td className="table-cell">{e.cronograma_id}</td>
                  <td className="table-cell">{e.fecha_entrega ? e.fecha_entrega.slice(0, 10) : ''}</td>
                  <td className="table-cell">{e.producto_id}</td>
                  <td className="table-cell">{e.estado}</td>
                  <td className="table-cell">
                    <button className="btn" onClick={() => openEditModal(e)} disabled={loading} title="Editar entrega" aria-label="Editar entrega" tabIndex={0} style={{ marginRight: 8, background: '#ffc107', color: '#333' }}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(e.id)} disabled={loading} title="Eliminar entrega" aria-label="Eliminar entrega" tabIndex={0} style={{ background: '#dc3545', color: '#fff' }}>Eliminar</button>
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


