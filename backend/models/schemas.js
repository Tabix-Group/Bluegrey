import Joi from 'joi';

export const clienteSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  direccion: Joi.string().allow('', null),
  categoria: Joi.string().allow('', null),
  otros_datos: Joi.object().allow(null)
});


export const contactoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  telefono: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().allow('', null),
  cliente_id: Joi.number().integer().required()
});

export const productoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  descripcion: Joi.string().allow('', null),
  categoria: Joi.string().allow('', null),
  precio: Joi.number().min(0).required()
});

export const cronogramaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  descripcion: Joi.string().allow('', null),
  cliente_id: Joi.number().integer().required(),
  fecha_inicio: Joi.date().required(),
  recurrencia: Joi.string().valid('diaria', 'semanal', 'mensual').required(),
  activo: Joi.boolean().default(true)
});

export const entregaSchema = Joi.object({
  cronograma_id: Joi.number().integer().required(),
  fecha_entrega: Joi.date().required(),
  producto_id: Joi.number().integer().required(),
  estado: Joi.string().valid('pendiente', 'enviado', 'entregado').default('pendiente')
});

export const modeloMensajeSchema = Joi.object({
  categoria: Joi.string().allow('', null),
  texto_base: Joi.string().required()
});
