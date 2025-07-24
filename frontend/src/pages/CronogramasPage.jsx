

// Estilos únicos (deben estar antes del componente para estar disponibles)
import React, { useState, useEffect } from 'react';
import CustomModal from '../components/CustomModal';
import { getCronogramas, createCronograma, deleteCronograma, updateCronograma } from '../services/cronogramasService';
import { getClientes } from '../services/clientesService';


const pageBtnStyle = { background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' };

export default function CronogramasPage() {
  const [cronogramas, setCronogramas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    cargarCronogramas();
    cargarClientes();
  }, []);

  async function cargarCronogramas() {
    setCronogramas(await getCronogramas());
  }
  async function cargarClientes() {
    setClientes(await getClientes());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(cronograma) {
    setEditId(cronograma.id);
    setForm({
      nombre: cronograma.nombre,
      descripcion: cronograma.descripcion || '',
      cliente_id: cronograma.cliente_id || '',
      fecha_inicio: cronograma.fecha_inicio ? cronograma.fecha_inicio.slice(0, 10) : '',
      recurrencia: cronograma.recurrencia || 'diaria',
      activo: cronograma.activo
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
    setForm({ nombre: '', descripcion: '', cliente_id: '', fecha_inicio: '', recurrencia: 'diaria', activo: true });
    setFormError('');
    setFormSuccess('');
    setLoading(false);
  }

  function validateForm() {
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';
    if (!form.cliente_id.trim() || isNaN(Number(form.cliente_id))) return 'Cliente ID es obligatorio y debe ser numérico.';
    if (!form.fecha_inicio.trim()) return 'La fecha de inicio es obligatoria.';
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
      const data = { ...form, cliente_id: Number(form.cliente_id), activo: Boolean(form.activo) };
      if (editId) {
        await updateCronograma(editId, data);
        setFormSuccess('Cronograma actualizado correctamente.');
      } else {
        await createCronograma(data);
        setFormSuccess('Cronograma agregado correctamente.');
      }
      cargarCronogramas();
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
      await deleteCronograma(id);
      setFormSuccess('Cronograma eliminado.');
      cargarCronogramas();
    } catch {
      setFormError('Error al eliminar.');
    } finally {
      setLoading(false);
    }
  }

  // Búsqueda y paginación con useMemo para evitar errores de referencia
  const { filtered, paged, totalPages } = React.useMemo(() => {
    let filtered = [];
    let paged = [];
    let totalPages = 1;
    if (Array.isArray(cronogramas)) {
      filtered = cronogramas.filter(c =>
        (c.nombre && c.nombre.toLowerCase().includes(search.toLowerCase())) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase())) ||
        (c.cliente_id && String(c.cliente_id).includes(search))
      );
      totalPages = Math.ceil(filtered.length / pageSize) || 1;
      paged = filtered.slice((page - 1) * pageSize, page * pageSize);
    }
    // Siempre devolver arrays definidos
    return { filtered: filtered || [], paged: paged || [], totalPages: totalPages || 1 };
  }, [cronogramas, search, page, pageSize]);

  // Log defensivo para depuración
  if (typeof window !== 'undefined') {
    window.__DEBUG_CRONOGRAMAS_PAGED = paged;
  }

  return (
    <div className="card card-wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Cronogramas</h2>
        <button className="btn btn-primary" onClick={openAddModal} title="Agregar un nuevo cronograma" aria-label="Agregar un nuevo cronograma" tabIndex={0}>
          Agregar cronograma
        </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o cliente ID..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input"
          title="Buscar cronogramas"
          aria-label="Buscar cronogramas"
          tabIndex={0}
        />
      </div>
      <CustomModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        title={editId ? 'Editar cronograma' : 'Agregar cronograma'}
      >
        <form onSubmit={handleSubmit} className="modal-content" aria-label="Formulario de cronograma">
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="input" title="Nombre del cronograma" aria-label="Nombre del cronograma" tabIndex={0} />
          <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} className="input" title="Descripción del cronograma" aria-label="Descripción del cronograma" tabIndex={0} />
          <select required value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))} className="input" title="Cliente asociado" aria-label="Cliente asociado" tabIndex={0}>
            <option value="">Seleccionar cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} (ID: {c.id})</option>
            ))}
          </select>
          <input required type="date" placeholder="Fecha de inicio" value={form.fecha_inicio} onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} className="input" title="Fecha de inicio" aria-label="Fecha de inicio" tabIndex={0} />
          <select value={form.recurrencia} onChange={e => setForm(f => ({ ...f, recurrencia: e.target.value }))} className="input" title="Recurrencia" aria-label="Recurrencia" tabIndex={0}>
            <option value="diaria">Diaria</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="bimestral">Bimestral</option>
            <option value="trimestral">Trimestral</option>
            <option value="cuatrimestral">Cuatrimestral</option>
            <option value="semestral">Semestral</option>
          </select>
          <label className="flex-row gap-8 font-15" title="¿Está activo?" aria-label="¿Está activo?">
            <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} tabIndex={0} /> Activo
          </label>
          <div className="flex-row gap-12 mt-8">
            <button type="submit" className="btn btn-primary" disabled={loading} title={editId ? 'Actualizar cronograma' : 'Agregar cronograma'} aria-label={editId ? 'Actualizar cronograma' : 'Agregar cronograma'} tabIndex={0}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Agregar')}</button>
            <button type="button" onClick={closeModal} className="btn btn-secondary" disabled={loading} title="Cancelar" aria-label="Cancelar" tabIndex={0}>Cancelar</button>
          </div>
          {loading && <div className="loader-container"><span className="loader"></span></div>}
        </form>
      </CustomModal>
      <div className="table-responsive card-table">
        <table className="table" role="table" aria-label="Tabla de cronogramas">
          <thead>
            <tr className="table-header">
              <th className="table-cell" scope="col">ID</th>
              <th className="table-cell" scope="col">Nombre</th>
              <th className="table-cell" scope="col">Descripción</th>
              <th className="table-cell" scope="col">Cliente</th>
              <th className="table-cell" scope="col">Fecha inicio</th>
              <th className="table-cell" scope="col">Recurrencia</th>
              <th className="table-cell" scope="col">Activo</th>
              <th className="table-cell" scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(paged) || paged.length === 0) ? (
              <tr>
                <td colSpan={8} className="table-cell text-center text-muted">No hay resultados para mostrar.</td>
              </tr>
            ) : (
              (paged || []).map(c => (
                <tr key={c.id} className="table-row">
                  <td className="table-cell">{c.id}</td>
                  <td className="table-cell">{c.nombre}</td>
                  <td className="table-cell">{c.descripcion}</td>
                  <td className="table-cell">{(clientes.find(cl => cl.id === c.cliente_id)?.nombre) || c.cliente_id}</td>
                  <td className="table-cell">{c.fecha_inicio ? c.fecha_inicio.slice(0, 10) : ''}</td>
                  <td className="table-cell">{c.recurrencia}</td>
                  <td className="table-cell">{c.activo ? 'Sí' : 'No'}</td>
                  <td className="table-cell">
                    <button onClick={() => openEditModal(c)} className="btn btn-warning mr-6" disabled={loading} title="Editar cronograma" aria-label="Editar cronograma" tabIndex={0}>Editar</button>{' '}
                    <button onClick={() => handleDelete(c.id)} className="btn btn-danger" disabled={loading} title="Eliminar cronograma" aria-label="Eliminar cronograma" tabIndex={0}>Eliminar</button>
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


