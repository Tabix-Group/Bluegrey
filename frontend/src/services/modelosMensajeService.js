const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getModelosMensaje() {
  const res = await fetch(`${API_URL}/modelos-mensaje`);
  return res.json();
}

export async function createModeloMensaje(modelo) {
  const res = await fetch(`${API_URL}/modelos-mensaje`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modelo)
  });
  return res.json();
}

export async function deleteModeloMensaje(id) {
  await fetch(`${API_URL}/modelos-mensaje/${id}`, { method: 'DELETE' });
}

export async function updateModeloMensaje(id, modelo) {
  const res = await fetch(`${API_URL}/modelos-mensaje/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modelo)
  });
  return res.json();
}
