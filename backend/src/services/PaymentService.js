const PagoTarjetaSimulado = require('./payment/PagoTarjetaSimulado');
const PagoYapeSimulado = require('./payment/PagoYapeSimulado');
const PagoMercadoPago = require('./payment/PagoMercadoPago');
const PagoPayPal = require('./payment/PagoPayPal');
const PagoStripe = require('./payment/PagoStripe');

class PaymentService {
  constructor() {
    this.metodos = {
      TARJETA_SIMULADO: PagoTarjetaSimulado,
      YAPE_SIMULADO: PagoYapeSimulado,
      MERCADO_PAGO: PagoMercadoPago,
      PAYPAL: PagoPayPal,
      STRIPE: PagoStripe
    };
  }

  getMetodosDisponibles() {
    return Object.keys(this.metodos);
  }

  getMetodo(nombre) {
    const metodo = this.metodos[nombre];
    if (!metodo) {
      throw new Error(`Método de pago '${nombre}' no soportado. Usa: ${this.getMetodosDisponibles().join(', ')}`);
    }
    return metodo;
  }

  async procesarPago(nombreMetodo, pedido, extra = {}) {
    const metodo = this.getMetodo(nombreMetodo);

    if (nombreMetodo === 'MERCADO_PAGO') {
      return await metodo.crearPreferencia(pedido, extra.items, extra.returnUrl);
    }

    if (nombreMetodo === 'PAYPAL') {
      return await metodo.crearOrden(pedido, extra.items);
    }

    if (nombreMetodo === 'STRIPE') {
      return await metodo.crearSesion(pedido, extra.items, extra.returnUrl);
    }

    return metodo.procesarPago(pedido);
  }
}

module.exports = new PaymentService();
