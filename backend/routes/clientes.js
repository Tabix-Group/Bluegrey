import * as Clientes from '../models/clientes.js';
import express from 'express';
const router = express.Router();

import { clienteSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await Clientes.getAllClientes();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Clientes.getClienteById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});


router.post('/', async (req, res) => {
  // Remove otros_datos from req.body if present
  const { nombre, direccion, categoria } = req.body;
  if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'El nombre es obligatorio.' });
  const data = await Clientes.createCliente({ nombre, direccion, categoria });
  res.status(201).json(data);
});


router.put('/:id', async (req, res) => {
  const { nombre, direccion, categoria } = req.body;
  const data = await Clientes.updateCliente(req.params.id, { nombre, direccion, categoria });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await Clientes.deleteCliente(req.params.id);
  res.status(204).end();
});

export default router;
