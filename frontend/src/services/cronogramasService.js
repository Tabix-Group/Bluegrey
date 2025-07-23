const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getCronogramas() {
  const res = await fetch(`${API_URL}/cronogramas`);
  return res.json();
}

export async function createCronograma(cronograma) {
  const res = await fetch(`${API_URL}/cronogramas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cronograma)
  });
  return res.json();
}

export async function deleteCronograma(id) {
  await fetch(`${API_URL}/cronogramas/${id}`, { method: 'DELETE' });
}

export async function updateCronograma(id, cronograma) {
  const res = await fetch(`${API_URL}/cronogramas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cronograma)
  });
  return res.json();
}
