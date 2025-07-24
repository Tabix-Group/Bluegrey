

import React, { useEffect, useState } from 'react';
import { getContactos, createContacto, deleteContacto, updateContacto } from '../services/contactosService';
import { getClientes } from '../services/clientesService';
import CustomModal from '../components/CustomModal';


export default function ContactosPage() {
  const [contactos, setContactos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', cliente_id: '' });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [clientes, setClientes] = useState([]);
  const pageSize = 8;

  // Búsqueda y paginación
  const filtered = contactos.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono && c.telefono.toLowerCase().includes(search.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize); // This line is removed

  useEffect(() => {
    cargarContactos();
    cargarClientes();
  }, []);

  async function cargarContactos() {
    setContactos(await getContactos());
  }
  async function cargarClientes() {
    setClientes(await getClientes());
  }

  function openAddModal() {
    setEditId(null);
    setForm({ nombre: '', telefono: '', email: '', cliente_id: '' });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }

  function openEditModal(contacto) {
    setEditId(contacto.id);
    setForm({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      email: contacto.email || '',
      cliente_id: contacto.cliente_id || ''
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  }
}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="" role="table" aria-label="Tabla de contactos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#888', fontSize: 16, padding: 24 }}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paged.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.telefono}</td>
                  <td>{c.email}</td>
                  <td>{clientes.find(cl => cl.id === c.cliente_id)?.nombre || ''}</td>
                  <td>
                    <button className="btn" onClick={() => openEditModal(c)} disabled={loading} title="Editar contacto" aria-label="Editar contacto" tabIndex={0}>Editar</button>{' '}
                    <button className="btn" onClick={() => handleDelete(c.id)} disabled={loading} title="Eliminar contacto" aria-label="Eliminar contacto" tabIndex={0}>Eliminar</button>
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

