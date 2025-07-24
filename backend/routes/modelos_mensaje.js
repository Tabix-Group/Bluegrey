import * as ModelosMensaje from '../models/modelos_mensaje.js';
import express from 'express';
const router = express.Router();

import { modeloMensajeSchema } from '../models/schemas.js';


// GET /api/modelos-mensaje
router.get('/', async (req, res) => {
  try {
    const data = await ModelosMensaje.getAllModelosMensaje();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener modelos de mensaje' });
  }
});


// GET /api/modelos-mensaje/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await ModelosMensaje.getModeloMensajeById(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener modelo de mensaje' });
  }
});


// POST /api/modelos-mensaje
router.post('/', async (req, res) => {
  const { error } = modeloMensajeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const data = await ModelosMensaje.createModeloMensaje(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear modelo de mensaje' });
  }
});


// PUT /api/modelos-mensaje/:id
router.put('/:id', async (req, res) => {
  const { texto_base } = req.body;
  if (!texto_base) {
    return res.status(400).json({ error: 'El campo texto_base es obligatorio.' });
  }
  try {
    const data = await ModelosMensaje.updateModeloMensaje(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Modelo de mensaje no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar modelo de mensaje' });
  }
});


// DELETE /api/modelos-mensaje/:id
router.delete('/:id', async (req, res) => {
  try {
    await ModelosMensaje.deleteModeloMensaje(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar modelo de mensaje' });
  }
});

export default router;
