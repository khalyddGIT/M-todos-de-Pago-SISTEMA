const { Router } = require('express');
const PagoController = require('../controllers/PagoController');

const router = Router();

router.get('/metodos', PagoController.metodos);
router.post('/procesar', PagoController.procesar);
router.get('/mercadopago/webhook', PagoController.webhook);
router.post('/mercadopago/webhook', PagoController.webhook);
router.post('/stripe/webhook', PagoController.stripeWebhook);
router.post('/paypal/capture', PagoController.paypalCapture);
router.get('/paypal/return', PagoController.paypalReturn);
router.get('/paypal/cancel', PagoController.paypalCancel);
router.get('/stripe/success', PagoController.stripeSuccess);
router.get('/stripe/cancel', PagoController.stripeCancel);

module.exports = router;
