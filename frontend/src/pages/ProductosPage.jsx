
import React, { useEffect, useState } from 'react';
import { getProductos, createProducto, deleteProducto, updateProducto } from '../services/productosService';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setProductos(await getProductos());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, precio: Number(form.precio) };
    if (editId) {
      await updateProducto(editId, data);
      setEditId(null);
    } else {
      await createProducto(data);
    }
    setForm({ nombre: '', descripcion: '', categoria: '', precio: '' });
    cargarProductos();
  }

  function handleEdit(producto) {
    setEditId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || '',
      precio: producto.precio || ''
    });
  }

  async function handleDelete(id) {
    await deleteProducto(id);
    cargarProductos();
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Productos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />{' '}
        <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />{' '}
        <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} />{' '}
        <input required type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', categoria: '', precio: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Descripción</th><th>Categoría</th><th>Precio</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.categoria}</td>
              <td>{p.precio}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>{' '}
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
