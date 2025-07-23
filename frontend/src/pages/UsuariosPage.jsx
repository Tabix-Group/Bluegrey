import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../services/usuariosService';

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
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <button
          onClick={openAddModal}
          style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          title="Agregar un nuevo usuario"
          aria-label="Agregar un nuevo usuario"
          tabIndex={0}
        >
          Agregar usuario
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          style={{ ...inputStyle, width: 260 }}
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          title="Buscar usuario (escriba y presione enter o espere)"
          aria-label="Buscar usuario"
          tabIndex={0}
        />
      </div>
      <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff', minHeight: 200, position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }} aria-label="Tabla de usuarios">
          <caption style={{ display: 'none' }}>Lista de usuarios</caption>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: 10, textAlign: 'left' }} title="Nombre del usuario">Nombre</th>
              <th style={{ padding: 10, textAlign: 'left' }} title="Correo electrónico">Email</th>
              <th style={{ padding: 10, textAlign: 'left' }} title="Rol del usuario">Rol</th>
              <th style={{ padding: 10, textAlign: 'center' }} title="Acciones disponibles">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && !tableLoading && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888', padding: 24 }}>No hay usuarios.</td></tr>
            )}
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td style={{ padding: 10 }}>{usuario.nombre}</td>
                <td style={{ padding: 10 }}>{usuario.email}</td>
                <td style={{ padding: 10 }}>{usuario.rol}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>
                  <button
                    onClick={() => openEditModal(usuario)}
                    style={{ background: '#ffc107', color: '#333', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 8 }}
                    title="Editar usuario"
                    aria-label="Editar usuario"
                    tabIndex={0}
                  >Editar</button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                    title="Eliminar usuario"
                    aria-label="Eliminar usuario"
                    tabIndex={0}
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tableLoading && <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><span className="loader" style={{ border: '3px solid #eee', borderTop: '3px solid #007bff', borderRadius: '50%', width: 32, height: 32, display: 'inline-block', animation: 'spin 1s linear infinite' }}></span></div>}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 18, gap: 8 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ ...submitBtnStyle, background: '#eee', color: '#333', boxShadow: 'none' }}
            title="Página anterior"
            aria-label="Página anterior"
            tabIndex={0}
          >&lt;</button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Página {page} de {Math.max(1, Math.ceil(total / limit))}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
            style={{ ...submitBtnStyle, background: '#eee', color: '#333', boxShadow: 'none' }}
            title="Página siguiente"
            aria-label="Página siguiente"
            tabIndex={0}
          >&gt;</button>
        </div>
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar usuario' : 'Agregar usuario'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }} aria-label="Formulario de usuario">
          {formError && <div style={{ color: '#dc3545', background: '#fff0f0', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formError}</div>}
          {formSuccess && <div style={{ color: '#28a745', background: '#eafbe7', borderRadius: 6, padding: '8px 12px', fontSize: 15 }}>{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={inputStyle} title="Nombre" aria-label="Nombre" tabIndex={0} />
          <input required placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} title="Email" aria-label="Email" tabIndex={0} />
          {!editId && <input required type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} title="Contraseña" aria-label="Contraseña" tabIndex={0} />}
          <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))} style={inputStyle} title="Rol" aria-label="Rol" tabIndex={0}>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" style={{...submitBtnStyle, background:'#0056b3'}} disabled={loading} title={editId ? 'Guardar cambios' : 'Agregar usuario'} aria-label={editId ? 'Guardar cambios' : 'Agregar usuario'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Guardar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} style={cancelBtnStyle} disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div style={{ position: 'absolute', right: 16, bottom: 16 }}><span className="loader" style={{ border: '3px solid #eee', borderTop: '3px solid #007bff', borderRadius: '50%', width: 22, height: 22, display: 'inline-block', animation: 'spin 1s linear infinite' }}></span></div>}
        </form>
      </CustomModal>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
