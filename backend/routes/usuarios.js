const express = require('express');
const router = express.Router();
const usuariosCtrl = require('../controllers/usuarios');

router.get('/', usuariosCtrl.getUsuarios);
router.post('/', usuariosCtrl.createUsuario);
router.put('/:id', usuariosCtrl.updateUsuario);
router.delete('/:id', usuariosCtrl.deleteUsuario);

module.exports = router;
