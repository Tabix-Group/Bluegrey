

import React, { useEffect, useState } from 'react';
import { getProductos, createProducto, deleteProducto, updateProducto } from '../services/productosService';
import CustomModal from '../components/CustomModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setProductos(await getProductos());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' });
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
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, precio: Number(form.precio) };
    if (editId) {
      await updateProducto(editId, data);
    } else {
      await createProducto(data);
    }
    closeModal();
    cargarProductos();
  }

  async function handleDelete(id) {
    await deleteProducto(id);
    cargarProductos();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Productos</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Agregar producto
        </button>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar producto' : 'Agregar producto'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={inputStyle} />
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={inputStyle} />
          <input required type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} style={inputStyle} />
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
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>{p.nombre}</td>
                <td style={tdStyle}>{p.descripcion}</td>
                <td style={tdStyle}>{p.categoria}</td>
                <td style={tdStyle}>{p.precio}</td>
                <td style={tdStyle}>
                  <button onClick={() => openEditModal(p)} style={editBtnStyle}>Editar</button>{' '}
                  <button onClick={() => handleDelete(p.id)} style={deleteBtnStyle}>Eliminar</button>
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
