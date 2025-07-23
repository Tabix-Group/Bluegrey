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

router.put('/:id', async (req, res) => {
  const data = await Cronogramas.updateCronograma(req.params.id, req.body);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await Cronogramas.deleteCronograma(req.params.id);
  res.status(204).end();
});

export default router;
