
import React, { useEffect, useState } from 'react';
import { getClientes, createCliente, deleteCliente, updateCliente } from '../services/clientesService';
import CustomModal from '../components/CustomModal';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(false);
    cargarClientes();
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', direccion: '', categoria: '', otros_datos: '' });
    setModalOpen(true);
  }

  function handleEdit(cliente) {
    setEditId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      categoria: cliente.categoria || '',
      otros_datos: cliente.otros_datos ? JSON.stringify(cliente.otros_datos) : ''
    });
    setModalOpen(true);
  }

  async function handleDelete(id) {
    await deleteCliente(id);
    cargarClientes();
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Clientes</h2>
      <button onClick={openAddModal} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, fontWeight: 600, marginBottom: 24, cursor: 'pointer', float: 'right' }}>+ Agregar Cliente</button>
      <CustomModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} title={editId ? 'Editar Cliente' : 'Agregar Cliente'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
          <input placeholder="Dirección" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
          <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
          <input placeholder="Otros datos (JSON)" value={form.otros_datos} onChange={e => setForm(f => ({ ...f, otros_datos: e.target.value }))} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600 }}>{editId ? 'Actualizar' : 'Agregar'}</button>
            <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '10px 24px' }}>Cancelar</button>
          </div>
        </form>
      </CustomModal>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <thead style={{ background: '#1976d2', color: '#fff' }}>
          <tr>
            <th style={{ padding: 12 }}>ID</th>
            <th style={{ padding: 12 }}>Nombre</th>
            <th style={{ padding: 12 }}>Dirección</th>
            <th style={{ padding: 12 }}>Categoría</th>
            <th style={{ padding: 12 }}>Otros datos</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 10 }}>{c.id}</td>
              <td style={{ padding: 10 }}>{c.nombre}</td>
              <td style={{ padding: 10 }}>{c.direccion}</td>
              <td style={{ padding: 10 }}>{c.categoria}</td>
              <td style={{ padding: 10 }}><pre style={{ margin: 0 }}>{c.otros_datos ? JSON.stringify(c.otros_datos) : ''}</pre></td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleEdit(c)} style={{ background: '#ffa000', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', marginRight: 8, cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
