import pool from '../models/db.js';

// Busca entregas pendientes para hoy y las marca como enviadas (simulación)
export async function procesarEntregasPendientesHoy() {
  const hoy = new Date().toISOString().slice(0, 10);
  const { rows: entregas } = await pool.query(
    `SELECT e.*, c.nombre as cliente_nombre, c.id as cliente_id, p.nombre as producto_nombre
     FROM entregas e
     JOIN cronogramas cr ON e.cronograma_id = cr.id
     JOIN clientes c ON cr.cliente_id = c.id
     JOIN productos p ON e.producto_id = p.id
     WHERE e.fecha_entrega = $1 AND e.estado = 'pendiente'`,
    [hoy]
  );

  for (const entrega of entregas) {
    // Aquí iría la integración real con WhatsApp
    // Por ahora solo marcamos como enviado
    await pool.query('UPDATE entregas SET estado = $1 WHERE id = $2', ['enviado', entrega.id]);
    console.log(`Mensaje enviado a ${entrega.cliente_nombre} (${entrega.cliente_id}) para producto ${entrega.producto_nombre}`);
  }
  return entregas.length;
}
