import pool from '../models/db.js';

// Genera fechas según recurrencia
function generarFechas(fechaInicio, recurrencia, cantidad) {
  const fechas = [];
  let fecha = new Date(fechaInicio);
  for (let i = 0; i < cantidad; i++) {
    fechas.push(new Date(fecha));
    if (recurrencia === 'diaria') fecha.setDate(fecha.getDate() + 1);
    else if (recurrencia === 'semanal') fecha.setDate(fecha.getDate() + 7);
    else if (recurrencia === 'mensual') fecha.setMonth(fecha.getMonth() + 1);
  }
  return fechas;
}

// Genera entregas para un cronograma
export async function generarEntregasParaCronograma(cronogramaId, productoId, cantidad) {
  // Obtener cronograma
  const { rows } = await pool.query('SELECT * FROM cronogramas WHERE id = $1', [cronogramaId]);
  const cronograma = rows[0];
  if (!cronograma) throw new Error('Cronograma no encontrado');

  const fechas = generarFechas(cronograma.fecha_inicio, cronograma.recurrencia, cantidad);
  const entregas = [];
  for (const fecha of fechas) {
    const { rows: entregaRows } = await pool.query(
      'INSERT INTO entregas (cronograma_id, fecha_entrega, producto_id, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [cronogramaId, fecha.toISOString().slice(0, 10), productoId, 'pendiente']
    );
    entregas.push(entregaRows[0]);
  }
  return entregas;
}
