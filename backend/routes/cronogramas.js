import * as Cronogramas from '../models/cronogramas.js';
import express from 'express';
const router = express.Router();

import { cronogramaSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await Cronogramas.getAllCronogramas();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Cronogramas.getCronogramaById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { error } = cronogramaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const data = await Cronogramas.createCronograma(req.body);
  res.status(201).json(data);
});


// PUT /api/cronogramas/:id
router.put('/:id', async (req, res) => {
  const { nombre, cliente_id, fecha_inicio, recurrencia } = req.body;
  if (!nombre || !cliente_id || !fecha_inicio || !recurrencia) {
    return res.status(400).json({ error: 'Faltan campos requeridos (nombre, cliente_id, fecha_inicio, recurrencia)' });
  }
  try {
    const data = await Cronogramas.updateCronograma(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Cronograma no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cronograma' });
  }
});


// DELETE /api/cronogramas/:id
router.delete('/:id', async (req, res) => {
  try {
    await Cronogramas.deleteCronograma(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cronograma' });
  }
});

export default router;
