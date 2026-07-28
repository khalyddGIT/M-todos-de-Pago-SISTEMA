const PaymentService = require('../services/PaymentService');
const PedidoService = require('../services/PedidoService');
const PagoMercadoPago = require('../services/payment/PagoMercadoPago');
const PagoPayPal = require('../services/payment/PagoPayPal');
const PagoStripe = require('../services/payment/PagoStripe');

class PagoController {
  async procesar(req, res, next) {
    try {
      const { pedido_id, metodo } = req.body;
      const returnUrl = `${req.protocol}://${req.get('host')}`;

      const parsedId = parseInt(pedido_id);
      if (!pedido_id || isNaN(parsedId) || !metodo) {
        return res.status(400).json({ error: 'Se requiere un pedido_id válido y un metodo de pago' });
      }

      const pedido = await PedidoService.obtenerPorId(parsedId);

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      if (pedido.estado === 'PAGADO') {
        return res.status(400).json({
          error: 'Este pedido ya fue pagado previamente.'
        });
      }

      const apiBaseUrl = `${returnUrl}/api/pagos`;
      const returnUrlMetodo = metodo === 'STRIPE' ? apiBaseUrl : `${apiBaseUrl}/mercadopago`;

      const resultado = await PaymentService.procesarPago(metodo, pedido, {
        items: pedido.items,
        returnUrl: returnUrlMetodo
      });

      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }

  async webhook(req, res, next) {
    try {
      const { type, data } = req.query;
      const paymentId = req.query['data.id'] || data?.id || req.body?.data?.id;
      const topic = type || req.query.topic || req.body?.type;

      if (paymentId && topic) {
        await PagoMercadoPago.procesarWebhook(paymentId, topic);
      }

      res.status(200).send('OK');
    } catch (err) {
      next(err);
    }
  }

  async stripeWebhook(req, res, next) {
    try {
      const event = req.body;
      if (event && event.type === 'checkout.session.completed') {
        const session = event.data?.object;
        if (session && session.id) {
          await PagoStripe.capturarSesion(session.id);
        }
      }
      res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  }

  async paypalCapture(req, res, next) {
    try {
      const { paypal_order_id } = req.body;

      if (!paypal_order_id) {
        return res.status(400).json({ error: 'Se requiere paypal_order_id' });
      }

      const pedido = await PagoPayPal.capturarOrden(paypal_order_id);

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado para esta transaccion' });
      }

      res.json({
        success: pedido.estado === 'PAGADO',
        transaction_id: paypal_order_id,
        estado: pedido.estado,
        metodo: 'PAYPAL',
        monto: pedido.total,
        message: pedido.estado === 'PAGADO'
          ? 'Pago con PayPal procesado exitosamente'
          : 'Pago con PayPal no completado'
      });
    } catch (err) {
      next(err);
    }
  }

  async paypalReturn(req, res, next) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?paypal=error&msg=No+token`);
      }

      const pedido = await PagoPayPal.capturarOrden(token);

      if (!pedido) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?paypal=error&msg=Pedido+no+encontrado`);
      }

      const exito = pedido.estado === 'PAGADO' ? 'success' : 'error';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?paypal=${exito}&order=${pedido.id}`);
    } catch (err) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?paypal=error&msg=${encodeURIComponent(err.message)}`);
    }
  }

  paypalCancel(req, res) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?paypal=cancelled`);
  }

  async stripeSuccess(req, res, next) {
    try {
      const { session_id } = req.query;
      if (!session_id) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?stripe=error&msg=No+session`);
      }

      const pedido = await PagoStripe.capturarSesion(session_id);

      if (!pedido) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?stripe=error&msg=Pedido+no+encontrado`);
      }

      const exito = pedido.estado === 'PAGADO' ? 'success' : 'error';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?stripe=${exito}&order=${pedido.id}`);
    } catch (err) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?stripe=error&msg=${encodeURIComponent(err.message)}`);
    }
  }

  stripeCancel(req, res) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?stripe=cancelled`);
  }

  metodos(req, res) {
    res.json(PaymentService.getMetodosDisponibles());
  }
}

module.exports = new PagoController();
