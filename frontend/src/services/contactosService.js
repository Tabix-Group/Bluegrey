const API_URL = 'http://localhost:3000/api';

export async function getContactos() {
  const res = await fetch(`${API_URL}/contactos`);
  return res.json();
}

export async function createContacto(contacto) {
  const res = await fetch(`${API_URL}/contactos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contacto)
  });
  return res.json();
}

export async function deleteContacto(id) {
  await fetch(`${API_URL}/contactos/${id}`, { method: 'DELETE' });
}

export async function updateContacto(id, contacto) {
  const res = await fetch(`${API_URL}/contactos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contacto)
  });
  return res.json();
}
