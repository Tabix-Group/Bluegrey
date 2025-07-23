import { procesarEntregasPendientesHoy } from '../controllers/wa_auto.js';
import express from 'express';
const router = express.Router();

// POST /api/wa/procesar-hoy
router.post('/procesar-hoy', async (req, res) => {
  try {
    const cantidad = await procesarEntregasPendientesHoy();
    res.json({ mensajes_enviados: cantidad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
