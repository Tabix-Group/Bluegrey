const API_URL = 'http://localhost:3000/api';

export async function getClientes() {
  const res = await fetch(`${API_URL}/clientes`);
  return res.json();
}

export async function createCliente(cliente) {
  const res = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return res.json();
}

export async function deleteCliente(id) {
  await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
}

export async function updateCliente(id, cliente) {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return res.json();
}
