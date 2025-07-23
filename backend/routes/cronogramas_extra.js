import { generarEntregasParaCronograma } from '../controllers/entregas_auto.js';
import express from 'express';
const router = express.Router();

// POST /api/cronogramas/:id/generar-entregas
router.post('/:id/generar-entregas', async (req, res) => {
  const { producto_id, cantidad } = req.body;
  try {
    const entregas = await generarEntregasParaCronograma(req.params.id, producto_id, cantidad);
    res.status(201).json(entregas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
