import * as Contactos from '../models/contactos.js';
import express from 'express';
const router = express.Router();

import { contactoSchema } from '../models/schemas.js';

router.get('/', async (req, res) => {
  const data = await Contactos.getAllContactos();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Contactos.getContactoById(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { error } = contactoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const data = await Contactos.createContacto(req.body);
  res.status(201).json(data);
});

router.put('/:id', async (req, res) => {
  const data = await Contactos.updateContacto(req.params.id, req.body);
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  await Contactos.deleteContacto(req.params.id);
  res.status(204).end();
});

export default router;
