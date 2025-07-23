import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());


import clientesRouter from './routes/clientes.js';
import contactosRouter from './routes/contactos.js';
import productosRouter from './routes/productos.js';
import cronogramasRouter from './routes/cronogramas.js';
import entregasRouter from './routes/entregas.js';
import modelosMensajeRouter from './routes/modelos_mensaje.js';
import usuariosRouter from './routes/usuarios.js'; // placeholder for context

// Fix for CommonJS export in usuariosRouter
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const usuariosRouter = require('./routes/usuarios.js');

import cronogramasExtraRouter from './routes/cronogramas_extra.js';

import waRouter from './routes/wa.js';

import cron from 'node-cron';
import { procesarEntregasPendientesHoy } from './controllers/wa_auto.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

app.get('/', (req, res) => {
  res.send('WA Backend API funcionando');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/clientes', clientesRouter);
app.use('/api/contactos', contactosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/cronogramas', cronogramasRouter);
app.use('/api/cronogramas', cronogramasExtraRouter);
app.use('/api/entregas', entregasRouter);
app.use('/api/modelos-mensaje', modelosMensajeRouter);
app.use('/api/usuarios', usuariosRouter);

app.use('/api/wa', waRouter);

// Tarea programada diaria a las 08:00
cron.schedule('0 8 * * *', async () => {
  try {
    const cantidad = await procesarEntregasPendientesHoy();
    console.log(`[CRON] Mensajes enviados hoy: ${cantidad}`);
  } catch (err) {
    console.error('[CRON] Error procesando entregas:', err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
