import * as Clientes from '../models/clientes.js';
import * as Contactos from '../models/contactos.js';
import { enviarMensajeWhatsApp } from '../services/yoizen.js';
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



// POST /api/clientes
router.post('/', async (req, res) => {
  // Solo aceptar los campos válidos
  const { nombre, direccion, categoria } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }
  try {
    const data = await Clientes.createCliente({ nombre, direccion, categoria });
    // Buscar el primer contacto asociado
    const contacto = await Contactos.getPrimerContactoByClienteId(data.id);
    if (contacto && contacto.telefono) {
      // Normalizar número a formato internacional (Argentina)
      let numero = contacto.telefono.trim();
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
  } catch (err) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});



// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  const { nombre, direccion, categoria } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }
  try {
    const data = await Clientes.updateCliente(req.params.id, { nombre, direccion, categoria });
    if (!data) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});


// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  try {
    await Clientes.deleteCliente(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

export default router;
