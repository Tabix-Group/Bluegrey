const API_URL = 'http://localhost:3000/api';

export async function getEntregas() {
  const res = await fetch(`${API_URL}/entregas`);
  return res.json();
}

export async function createEntrega(entrega) {
  const res = await fetch(`${API_URL}/entregas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrega)
  });
  return res.json();
}

export async function deleteEntrega(id) {
  await fetch(`${API_URL}/entregas/${id}`, { method: 'DELETE' });
}

export async function updateEntrega(id, entrega) {
  const res = await fetch(`${API_URL}/entregas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entrega)
  });
  return res.json();
}
