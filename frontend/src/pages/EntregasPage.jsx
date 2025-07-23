
import React, { useEffect, useState } from 'react';
import { getEntregas, createEntrega, deleteEntrega, updateEntrega } from '../services/entregasService';

export default function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [form, setForm] = useState({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarEntregas();
  }, []);

  async function cargarEntregas() {
    setEntregas(await getEntregas());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cronograma_id: Number(form.cronograma_id), producto_id: Number(form.producto_id) };
    if (editId) {
      await updateEntrega(editId, data);
      setEditId(null);
    } else {
      await createEntrega(data);
    }
    setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' });
    cargarEntregas();
  }

  function handleEdit(entrega) {
    setEditId(entrega.id);
    setForm({
      cronograma_id: entrega.cronograma_id || '',
      fecha_entrega: entrega.fecha_entrega ? entrega.fecha_entrega.slice(0, 10) : '',
      producto_id: entrega.producto_id || '',
      estado: entrega.estado || 'pendiente'
    });
  }

  async function handleDelete(id) {
    await deleteEntrega(id);
    cargarEntregas();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto' }}>
      <h2>Entregas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Cronograma ID" value={form.cronograma_id} onChange={e => setForm(f => ({ ...f, cronograma_id: e.target.value }))} />{' '}
        <input required type="date" placeholder="Fecha entrega" value={form.fecha_entrega} onChange={e => setForm(f => ({ ...f, fecha_entrega: e.target.value }))} />{' '}
        <input required placeholder="Producto ID" value={form.producto_id} onChange={e => setForm(f => ({ ...f, producto_id: e.target.value }))} />{' '}
        <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
          <option value="pendiente">Pendiente</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
        </select>{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ cronograma_id: '', fecha_entrega: '', producto_id: '', estado: 'pendiente' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Cronograma ID</th><th>Fecha entrega</th><th>Producto ID</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.cronograma_id}</td>
              <td>{e.fecha_entrega ? e.fecha_entrega.slice(0, 10) : ''}</td>
              <td>{e.producto_id}</td>
              <td>{e.estado}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Editar</button>{' '}
                <button onClick={() => handleDelete(e.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
