const { Router } = require('express');
const PedidoController = require('../controllers/PedidoController');

const router = Router();

router.get('/', PedidoController.listar);
router.get('/:id', PedidoController.obtener);
router.post('/generar', PedidoController.generar);
router.patch('/:id/estado', PedidoController.actualizarEstado);

module.exports = router;
