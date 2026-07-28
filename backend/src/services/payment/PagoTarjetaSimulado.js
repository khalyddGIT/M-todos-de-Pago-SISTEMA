const MetodoPago = require('./MetodoPago');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../config/database');
const PedidoRepository = require('../../repositories/PedidoRepository');

class PagoTarjetaSimulado extends MetodoPago {
  getNombre() {
    return 'TARJETA_SIMULADO';
  }

  async procesarPago(pedido) {
    if (pedido.total <= 0) {
      return {
        success: false,
        estado: 'RECHAZADO',
        message: 'El monto del pedido debe ser mayor a cero'
      };
    }

    const transactionId = `TARJETA-${uuidv4().slice(0, 8).toUpperCase()}`;
    const estado = 'PAGADO';

    await PedidoRepository.updateEstado(pedido.id, estado, transactionId, this.getNombre());

    await db.run(
      'INSERT INTO transacciones (pedido_id, metodo_pago, monto, transaction_id, estado) VALUES (?, ?, ?, ?, ?)',
      [pedido.id, this.getNombre(), pedido.total, transactionId, estado]
    );

    const items = await PedidoRepository.getItems(pedido.id);
    const ProductoRepository = require('../../repositories/ProductoRepository');
    for (const item of items) {
      await ProductoRepository.updateStock(item.producto_id, item.cantidad);
    }

    return {
      success: true,
      transaction_id: transactionId,
      estado: 'PAGADO',
      metodo: this.getNombre(),
      monto: pedido.total,
      message: 'Pago con tarjeta de crédito/débito procesado exitosamente'
    };
  }
}

module.exports = new PagoTarjetaSimulado();
