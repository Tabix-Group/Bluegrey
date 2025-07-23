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

router.put('/:id', async (req, res) => {
  const data = await Entregas.updateEntrega(req.params.id, req.body);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await Entregas.deleteEntrega(req.params.id);
  res.status(204).end();
});

export default router;
