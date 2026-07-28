const { Router } = require('express');
const CarritoController = require('../controllers/CarritoController');

const router = Router();

router.get('/', CarritoController.obtener);
router.post('/agregar', CarritoController.agregar);
router.put('/actualizar/:id', CarritoController.actualizar);
router.delete('/eliminar/:id', CarritoController.eliminar);
router.post('/limpiar', CarritoController.limpiar);

module.exports = router;
