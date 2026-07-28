const CarritoRepository = require('../repositories/CarritoRepository');
const ProductoRepository = require('../repositories/ProductoRepository');

class CarritoService {
  async obtener(sessionId) {
    const items = await CarritoRepository.findBySession(sessionId);
    const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    return { items, subtotal };
  }

  async agregar(sessionId, productoId, cantidad = 1) {
    if (!sessionId) {
      const error = new Error('Se requiere un session_id');
      error.status = 400;
      throw error;
    }

    const producto = await ProductoRepository.findById(productoId);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    if (!(await ProductoRepository.hasStock(productoId, cantidad))) {
      const error = new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
      error.status = 400;
      throw error;
    }

    await CarritoRepository.addItem(sessionId, productoId, cantidad);
    return await this.obtener(sessionId);
  }

  async actualizarCantidad(itemId, cantidad, sessionId) {
    if (cantidad < 1) {
      const error = new Error('La cantidad debe ser al menos 1');
      error.status = 400;
      throw error;
    }

    const items = await CarritoRepository.findBySession(sessionId);
    const item = items.find(i => i.id === itemId);
    if (!item) {
      const error = new Error('Item no encontrado en el carrito');
      error.status = 404;
      throw error;
    }

    if (!(await ProductoRepository.hasStock(item.producto_id, cantidad))) {
      const error = new Error(`Stock insuficiente. Disponible: ${item.stock}`);
      error.status = 400;
      throw error;
    }

    await CarritoRepository.updateQuantity(itemId, cantidad);
    return await this.obtener(sessionId);
  }

  async eliminarItem(itemId, sessionId) {
    const items = await CarritoRepository.findBySession(sessionId);
    const item = items.find(i => i.id === itemId);
    if (!item) {
      const error = new Error('Item no encontrado en el carrito');
      error.status = 404;
      throw error;
    }

    await CarritoRepository.removeItem(itemId);
    return await this.obtener(sessionId);
  }

  async limpiar(sessionId) {
    await CarritoRepository.clearSession(sessionId);
    return { items: [], subtotal: 0 };
  }
}

module.exports = new CarritoService();
