const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getClientes() {
  const res = await fetch(`${API_URL}/clientes`);
  return res.json();
}


export async function createCliente(cliente) {
  // Only send allowed fields
  const { nombre, direccion, categoria } = cliente;
  const res = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, direccion, categoria })
  });
  return res.json();
}

export async function deleteCliente(id) {
  await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
}


export async function updateCliente(id, cliente) {
  const { nombre, direccion, categoria } = cliente;
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, direccion, categoria })
  });
  return res.json();
}
