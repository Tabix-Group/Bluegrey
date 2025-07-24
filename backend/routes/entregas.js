import * as Entregas from '../models/entregas.js';
import express from 'express';
const router = express.Router();

import { entregaSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await Entregas.getAllEntregas();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Entregas.getEntregaById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { error } = entregaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const data = await Entregas.createEntrega(req.body);
  res.status(201).json(data);
});


// PUT /api/entregas/:id
router.put('/:id', async (req, res) => {
  const { cronograma_id, fecha_entrega, producto_id, estado } = req.body;
  if (!cronograma_id || !fecha_entrega || !producto_id) {
    return res.status(400).json({ error: 'Faltan campos requeridos (cronograma_id, fecha_entrega, producto_id)' });
  }
  try {
    const data = await Entregas.updateEntrega(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Entrega no encontrada' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar entrega' });
  }
});


// DELETE /api/entregas/:id
router.delete('/:id', async (req, res) => {
  try {
    await Entregas.deleteEntrega(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar entrega' });
  }
});

export default router;
