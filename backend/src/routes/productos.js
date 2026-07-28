const { Router } = require('express');
const ProductoController = require('../controllers/ProductoController');

const router = Router();

router.get('/', ProductoController.listar);
router.get('/:id', ProductoController.obtener);
router.post('/', ProductoController.crear);
router.put('/:id', ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;
