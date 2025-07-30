import * as Contactos from '../models/contactos.js';
import { enviarMensajeWhatsApp } from '../services/yoizen.js';
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
  if (data && data.telefono) {
    // Normalizar número a formato internacional (Argentina)
    let numero = data.telefono.trim();
    if (/^11\d{8}$/.test(numero)) {
      numero = '54' + numero;
    } else if (/^\d{10}$/.test(numero) && numero.startsWith('15')) {
      // Si empieza con 15, lo cambiamos a 11 (caso celulares viejos)
      numero = '5411' + numero.slice(2);
    }
    try {
      await enviarMensajeWhatsApp(numero, 'Hola, te escribimos desde NeoSalud para coordinar tu entrega, en las próximas horas recibiras un nuevo mensaje con el detalle de tu pedido');
    } catch (err) {
      console.error('Error enviando WhatsApp al contacto:', err.message);
    }
  }
  res.status(201).json(data);
});


// PUT /api/contactos/:id
router.put('/:id', async (req, res) => {
  const { nombre, telefono, email, cliente_id } = req.body;
  if (!nombre || !telefono || !cliente_id) {
    return res.status(400).json({ error: 'Faltan campos requeridos (nombre, telefono, cliente_id)' });
  }
  try {
    const data = await Contactos.updateContacto(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
});


// DELETE /api/contactos/:id
router.delete('/:id', async (req, res) => {
  try {
    await Contactos.deleteContacto(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});

export default router;
