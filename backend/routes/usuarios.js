import express from 'express';
import * as usuariosCtrl from '../controllers/usuarios.js';

const router = express.Router();
router.get('/', usuariosCtrl.getUsuarios);
router.post('/', usuariosCtrl.createUsuario);
router.put('/:id', usuariosCtrl.updateUsuario);
router.delete('/:id', usuariosCtrl.deleteUsuario);

export default router;
