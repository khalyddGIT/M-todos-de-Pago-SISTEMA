const PedidoRepository = require('../repositories/PedidoRepository');
const CarritoRepository = require('../repositories/CarritoRepository');
const ProductoRepository = require('../repositories/ProductoRepository');

class PedidoService {
  async listar() {
    const pedidos = await PedidoRepository.findAll();
    const result = [];
    for (const p of pedidos) {
      const items = await PedidoRepository.getItems(p.id);
      result.push({
        ...p,
        items
      });
    }
    return result;
  }

  async obtenerPorId(id) {
    const pedido = await PedidoRepository.findById(id);
    if (!pedido) {
      const error = new Error('Pedido no encontrado');
      error.status = 404;
      throw error;
    }
    pedido.items = await PedidoRepository.getItems(id);
    return pedido;
  }

  async listarPorSession(sessionId) {
    const pedidos = await PedidoRepository.findBySession(sessionId);
    const result = [];
    for (const p of pedidos) {
      const items = await PedidoRepository.getItems(p.id);
      result.push({
        ...p,
        items
      });
    }
    return result;
  }

  async generar(sessionId) {
    if (!sessionId) {
      const error = new Error('Se requiere un session_id');
      error.status = 400;
      throw error;
    }

    const carrito = await CarritoRepository.findBySession(sessionId);
    if (!carrito.length) {
      const error = new Error('El carrito está vacío');
      error.status = 400;
      throw error;
    }

    for (const item of carrito) {
      if (!(await ProductoRepository.hasStock(item.producto_id, item.cantidad))) {
        const error = new Error(
          `Stock insuficiente para "${item.nombre}". Disponible: ${item.stock}`
        );
        error.status = 400;
        throw error;
      }
    }

    const total = await CarritoRepository.getTotal(sessionId);

    const pedido = await PedidoRepository.create({ sessionId, total });

    for (const item of carrito) {
      await PedidoRepository.addItem(pedido.id, item.producto_id, item.cantidad, item.precio);
    }

    // Nota: El carrito NO se vacía aquí. Solo se vacía cuando el pago se confirme como PAGADO.

    pedido.items = await PedidoRepository.getItems(pedido.id);
    return pedido;
  }

  async actualizarEstado(id, estado) {
    const pedido = await this.obtenerPorId(id);
    const updated = await PedidoRepository.updateEstado(id, estado);
    updated.items = await PedidoRepository.getItems(id);
    return updated;
  }
}

module.exports = new PedidoService();
