import * as Productos from '../models/productos.js';
import express from 'express';
const router = express.Router();

import { productoSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await Productos.getAllProductos();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Productos.getProductoById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { error } = productoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const data = await Productos.createProducto(req.body);
  res.status(201).json(data);
});


// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).json({ error: 'Faltan campos requeridos (nombre, precio)' });
  }
  try {
    const data = await Productos.updateProducto(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});


// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  try {
    await Productos.deleteProducto(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
