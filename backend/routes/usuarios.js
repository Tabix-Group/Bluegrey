import express from 'express';
import * as usuariosCtrl from '../controllers/usuarios.js';

const router = express.Router();


// Login de usuario
router.post('/login', usuariosCtrl.loginUsuario);

router.get('/', usuariosCtrl.getUsuarios);
router.get('/:id', usuariosCtrl.getUsuarioById);
router.post('/', usuariosCtrl.createUsuario);
router.put('/:id', usuariosCtrl.updateUsuario);
router.delete('/:id', usuariosCtrl.deleteUsuario);

export default router;
