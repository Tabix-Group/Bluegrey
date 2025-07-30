import express from 'express';
import { enviarMensajeWhatsApp } from '../services/yoizen.js';

const router = express.Router();

// Webhook para recibir mensajes entrantes de Yoizen
router.post('/webhook', async (req, res) => {
  try {
    const evento = req.body;
    // Procesa solo si hay mensajes
    if (evento.messages && evento.messages[0]) {
      const mensaje = evento.messages[0];
      const numero = mensaje.from;
      const texto = mensaje.text?.body || '';
      // Ejemplo: respuesta automática a "hola"
      if (texto.trim().toLowerCase() === 'hola') {
        await enviarMensajeWhatsApp(numero, '¡Hola! ¿En qué puedo ayudarte?');
      }
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
