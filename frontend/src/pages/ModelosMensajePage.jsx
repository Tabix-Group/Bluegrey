
import React, { useEffect, useState } from 'react';
import { getModelosMensaje, createModeloMensaje, deleteModeloMensaje, updateModeloMensaje } from '../services/modelosMensajeService';

export default function ModelosMensajePage() {
  const [modelos, setModelos] = useState([]);
  const [form, setForm] = useState({ categoria: '', texto_base: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarModelos();
  }, []);

  async function cargarModelos() {
    setModelos(await getModelosMensaje());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await updateModeloMensaje(editId, form);
      setEditId(null);
    } else {
      await createModeloMensaje(form);
    }
    setForm({ categoria: '', texto_base: '' });
    cargarModelos();
  }

  function handleEdit(modelo) {
    setEditId(modelo.id);
    setForm({
      categoria: modelo.categoria || '',
      texto_base: modelo.texto_base || ''
    });
  }

  async function handleDelete(id) {
    await deleteModeloMensaje(id);
    cargarModelos();
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <h2>Modelos de Mensaje</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} />{' '}
        <input required placeholder="Texto base" value={form.texto_base} onChange={e => setForm(f => ({ ...f, texto_base: e.target.value }))} />{' '}
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ categoria: '', texto_base: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Categoría</th><th>Texto base</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modelos.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.categoria}</td>
              <td>{m.texto_base}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Editar</button>{' '}
                <button onClick={() => handleDelete(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
