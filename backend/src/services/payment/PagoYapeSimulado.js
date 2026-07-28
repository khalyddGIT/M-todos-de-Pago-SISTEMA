const MetodoPago = require('./MetodoPago');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../config/database');
const PedidoRepository = require('../../repositories/PedidoRepository');

class PagoYapeSimulado extends MetodoPago {
  getNombre() {
    return 'YAPE_SIMULADO';
  }

  generarQR() {
    const codigo = `YAPE-${uuidv4().slice(0, 12).toUpperCase()}`;
    return {
      codigo_qr: codigo,
      numero_referencia: `REF-${Date.now().toString(36).toUpperCase()}`,
      mensaje: 'Escanea el código QR con Yape para pagar'
    };
  }

  async procesarPago(pedido) {
    if (pedido.total <= 0) {
      return {
        success: false,
        estado: 'RECHAZADO',
        message: 'El monto del pedido debe ser mayor a cero'
      };
    }

    const transactionId = `YAPE-${uuidv4().slice(0, 8).toUpperCase()}`;
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
      qr_info: this.generarQR(),
      message: 'Pago con Yape / Plin procesado exitosamente'
    };
  }
}

module.exports = new PagoYapeSimulado();
