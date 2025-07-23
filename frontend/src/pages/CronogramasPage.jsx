
import React, { useEffect, useState } from 'react';
import { getCronogramas, createCronograma, deleteCronograma, updateCronograma } from '../services/cronogramasService';

export default function CronogramasPage() {
  const [cronogramas, setCronogramas] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarCronogramas();
  }, []);

  async function cargarCronogramas() {
    setCronogramas(await getCronogramas());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, cliente_id: Number(form.cliente_id), activo: Boolean(form.activo) };
    if (editId) {
      await updateCronograma(editId, data);
      setEditId(null);
    } else {
      await createCronograma(data);
    }
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    cargarCronogramas();
  }

  function handleEdit(cronograma) {
    setEditId(cronograma.id);
    setForm({
      nombre: cronograma.nombre,
      descripcion: cronograma.descripcion || '',
      cliente_id: cronograma.cliente_id || '',
      fecha_inicio: cronograma.fecha_inicio ? cronograma.fecha_inicio.slice(0, 10) : '',
      recurrencia: cronograma.recurrencia || 'diaria',
      activo: cronograma.activo
    });
  }

  async function handleDelete(id) {
    await deleteCronograma(id);
    cargarCronogramas();
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Cronogramas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />{' '}
        <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />{' '}
        <input required placeholder="Cliente ID" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} />{' '}
        <input required type="date" placeholder="Fecha inicio" value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} />{' '}
        <select value={form.recurrencia} onChange={e => setForm(f => ({ ...f, recurrencia: e.target.value }))}>
          <option value="diaria">Diaria</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
        </select>{' '}
        <label>
          <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} /> Activo
        </label>{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Descripción</th><th>Cliente ID</th><th>Fecha inicio</th><th>Recurrencia</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cronogramas.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
              <td>{c.cliente_id}</td>
              <td>{c.fecha_inicio ? c.fecha_inicio.slice(0, 10) : ''}</td>
              <td>{c.recurrencia}</td>
              <td>{c.activo ? 'Sí' : 'No'}</td>
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
