

import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productosService';


export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setProductos(await getProductos());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(producto) {
    setEditId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || '',
      precio: producto.precio || ''
    });
    setFormError('');
  // const paged = filtered.slice((page - 1) * pageSize, page * pageSize); // Eliminado para evitar error de referencia no definida
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.precio.trim() || isNaN(Number(form.precio))) return 'El precio es obligatorio y debe ser numérico.';
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
      const data = { ...form, precio: Number(form.precio) };
      if (editId) {
        await updateProducto(editId, data);
        setFormSuccess('Producto actualizado correctamente.');
      } else {
        await createProducto(data);
        setFormSuccess('Producto agregado correctamente.');
      }
      cargarProductos();
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
      await deleteProducto(id);
      setFormSuccess('Producto eliminado.');
      cargarProductos();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación
  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase())) ||
    (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="app-content card">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Productos</h2>
        <button className="btn" onClick={openAddModal} title="Agregar un nuevo producto" aria-label="Agregar un nuevo producto" tabIndex={0}>
          Agregar producto
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          className=""
          type="text"
          placeholder="Buscar por nombre, descripción o categoría..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar productos"
          aria-label="Buscar productos"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar producto' : 'Agregar producto'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de producto">
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} title="Nombre del producto" aria-label="Nombre del producto" tabIndex={0} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} title="Descripción del producto" aria-label="Descripción del producto" tabIndex={0} />
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} title="Categoría del producto" aria-label="Categoría del producto" tabIndex={0} />
          <input required type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} title="Precio del producto" aria-label="Precio del producto" tabIndex={0} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" disabled={loading} title={editId ? 'Actualizar producto' : 'Agregar producto'} aria-label={editId ? 'Actualizar producto' : 'Agregar producto'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" className="btn" onClick={closeModal} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio</th>
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
              paged.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.categoria}</td>
                  <td>{p.precio}</td>
                  <td>
                    <button className="btn" onClick={() => openEditModal(p)} disabled={loading} title="Editar producto" aria-label="Editar producto" tabIndex={0} style={{ marginRight: 8, background: '#ffc107', color: '#333' }}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(p.id)} disabled={loading} title="Eliminar producto" aria-label="Eliminar producto" tabIndex={0} style={{ background: '#dc3545', color: '#fff' }}>Eliminar</button>
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
// (Eliminado bloque duplicado y variables de estilos al final del archivo)
