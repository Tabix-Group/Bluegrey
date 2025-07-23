import React, { useEffect, useState } from 'react';
import { getClientes, createCliente, deleteCliente, updateCliente } from '../services/clientesService';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    setClientes(await getClientes());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, otros_datos: form.otros_datos ? JSON.parse(form.otros_datos) : null };
    if (editId) {
      await updateCliente(editId, data);
      setEditId(null);
    } else {
      await createCliente(data);
    }
    setForm({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
    cargarClientes();
  }

  function handleEdit(cliente) {
    setEditId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      categoria: cliente.categoria || '',
      otros_datos: cliente.otros_datos ? JSON.stringify(cliente.otros_datos) : ''
    });
  }

  async function handleDelete(id) {
    await deleteCliente(id);
    cargarClientes();
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Clientes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />{' '}
        <input placeholder="Dirección" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />{' '}
        <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} />{' '}
        <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} />{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', direccion: '', categoria: '', otros_datos: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Dirección</th><th>Categoría</th><th>Otros datos</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.direccion}</td>
              <td>{c.categoria}</td>
              <td><pre style={{ margin: 0 }}>{c.otros_datos ? JSON.stringify(c.otros_datos) : ''}</pre></td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>{' '}
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
