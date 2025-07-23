import * as ModelosMensaje from '../models/modelos_mensaje.js';
import express from 'express';
const router = express.Router();

import { modeloMensajeSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await ModelosMensaje.getAllModelosMensaje();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await ModelosMensaje.getModeloMensajeById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { error } = modeloMensajeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const data = await ModelosMensaje.createModeloMensaje(req.body);
  res.status(201).json(data);
});

router.put('/:id', async (req, res) => {
  const data = await ModelosMensaje.updateModeloMensaje(req.params.id, req.body);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await ModelosMensaje.deleteModeloMensaje(req.params.id);
  res.status(204).end();
});

export default router;
