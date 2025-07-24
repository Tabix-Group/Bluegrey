
import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuariosService';

export default function UsuariosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'usuario' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [editId, setEditId] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  function openAddModal() {
    setForm({ nombre: '', email: '', password: '', rol: 'usuario' });
    setEditId(null);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(usuario) {
    setForm({ nombre: usuario.nombre, email: usuario.email, password: '', rol: usuario.rol });
    setEditId(usuario.id);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm({ nombre: '', email: '', password: '', rol: 'usuario' });
    setEditId(null);
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return 'El email es obligatorio y debe ser válido.';
    if (!editId && (!form.password.trim() || form.password.length < 6)) return 'La contraseña es obligatoria y debe tener al menos 6 caracteres.';
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
      if (editId) {
        await updateUsuario(editId, form);
        setFormSuccess('Usuario actualizado correctamente.');
      } else {
        await createUsuario(form);
        setFormSuccess('Usuario creado correctamente.');
      }
      setTimeout(() => { closeModal(); fetchUsuarios(); }, 900);
    } catch (err) {
      setFormError('Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsuarios() {
    setTableLoading(true);
    try {
      const res = await getUsuarios(search, page, limit);
      setUsuarios(Array.isArray(res.data) ? res.data : []);
      setTotal(typeof res.total === 'number' ? res.total : 0);
    } catch {
      setUsuarios([]);
      setTotal(0);
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, [search, page]);

  function handleDelete(id) {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      setTableLoading(true);
      deleteUsuario(id).then(() => fetchUsuarios());
    }
  }

  return (
    <div className="app-content card">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <button className="btn" onClick={openAddModal} title="Agregar un nuevo usuario" aria-label="Agregar un nuevo usuario" tabIndex={0}>
          Agregar usuario
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          className=""
          type="text"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar usuario"
          aria-label="Buscar usuario"
          tabIndex={0}
        />
      </div>
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && !tableLoading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: 24 }}>No hay usuarios.</td></tr>
            ) : (
              usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn" onClick={() => openEditModal(usuario)} disabled={loading} title="Editar usuario" aria-label="Editar usuario" tabIndex={0} style={{ marginRight: 8, background: '#ffc107', color: '#333' }}>Editar</button>
                    <button className="btn" onClick={() => handleDelete(usuario.id)} disabled={loading} title="Eliminar usuario" aria-label="Eliminar usuario" tabIndex={0} style={{ background: '#dc3545', color: '#fff' }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {tableLoading && <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><span className="loader"></span></div>}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} title="Página anterior" aria-label="Página anterior" tabIndex={0}>&lt;</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Página {page} de {Math.max(1, Math.ceil(total / limit))}</span>
          <button className="btn" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / limit)} title="Página siguiente" aria-label="Página siguiente" tabIndex={0}>&gt;</button>
        </div>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar usuario' : 'Agregar usuario'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de usuario">
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} title="Nombre" aria-label="Nombre" tabIndex={0} />
          <input required placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} title="Email" aria-label="Email" tabIndex={0} />
          {!editId && <input required type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} title="Contraseña" aria-label="Contraseña" tabIndex={0} />}
          <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))} title="Rol" aria-label="Rol" tabIndex={0}>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn" disabled={loading} title={editId ? 'Guardar cambios' : 'Agregar usuario'} aria-label={editId ? 'Guardar cambios' : 'Agregar usuario'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Guardar' : 'Agregar')}</button>
            <button type="button" className="btn" onClick={closeModal} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader"></span></div>}
        </form>
      </CustomModal>
    </div>
  );
}
