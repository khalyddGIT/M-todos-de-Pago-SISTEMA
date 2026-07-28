const { db } = require('../config/database');

class PedidoRepository {
  async findAll() {
    return await db.all('SELECT * FROM pedidos ORDER BY createdAt DESC');
  }

  async findById(id) {
    return await db.get('SELECT * FROM pedidos WHERE id = ?', [id]);
  }

  async findBySession(sessionId) {
    return await db.all(
      'SELECT * FROM pedidos WHERE session_id = ? ORDER BY createdAt DESC',
      [sessionId]
    );
  }

  async create({ sessionId, total }) {
    const result = await db.run(
      'INSERT INTO pedidos (session_id, total, estado) VALUES (?, ?, ?)',
      [sessionId, total, 'PENDIENTE']
    );
    return await this.findById(result.lastInsertRowid);
  }

  async addItem(pedidoId, productoId, cantidad, precioUnitario) {
    await db.run(
      'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [pedidoId, productoId, cantidad, precioUnitario]
    );
  }

  async getItems(pedidoId) {
    return await db.all(
      `SELECT pi.*, p.nombre, p.descripcion
      FROM pedido_items pi
      JOIN productos p ON pi.producto_id = p.id
      WHERE pi.pedido_id = ?`,
      [pedidoId]
    );
  }

  async updateEstado(id, estado, transactionId = null, metodoPago = null) {
    await db.run(
      `UPDATE pedidos SET estado = ?, transaction_id = COALESCE(?, transaction_id),
      metodo_pago = COALESCE(?, metodo_pago), updatedAt = datetime('now')
      WHERE id = ?`,
      [estado, transactionId, metodoPago, id]
    );
    const pedido = await this.findById(id);
    if (estado === 'PAGADO' && pedido && pedido.session_id) {
      const CarritoRepository = require('./CarritoRepository');
      await CarritoRepository.clearSession(pedido.session_id);
    }
    return pedido;
  }
}

module.exports = new PedidoRepository();
