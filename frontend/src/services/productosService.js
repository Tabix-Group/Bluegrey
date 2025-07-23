const API_URL = 'http://localhost:3000/api';

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
}

export async function createProducto(producto) {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  return res.json();
}

export async function deleteProducto(id) {
  await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
}

export async function updateProducto(id, producto) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  return res.json();
}
