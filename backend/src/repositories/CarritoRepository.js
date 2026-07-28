const { db } = require('../config/database');

class CarritoRepository {
  async findBySession(sessionId) {
    return await db.all(
      `SELECT c.id, c.producto_id, c.cantidad, p.nombre, p.descripcion, p.precio, p.stock
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.session_id = ?`,
      [sessionId]
    );
  }

  async findItem(sessionId, productoId) {
    return await db.get(
      'SELECT * FROM carrito WHERE session_id = ? AND producto_id = ?',
      [sessionId, productoId]
    );
  }

  async addItem(sessionId, productoId, cantidad) {
    const existente = await this.findItem(sessionId, productoId);
    if (existente) {
      await db.run('UPDATE carrito SET cantidad = cantidad + ? WHERE id = ?', [cantidad, existente.id]);
      return await this.findItem(sessionId, productoId);
    }
    await db.run(
      'INSERT INTO carrito (session_id, producto_id, cantidad) VALUES (?, ?, ?)',
      [sessionId, productoId, cantidad]
    );
    return await this.findItem(sessionId, productoId);
  }

  async updateQuantity(id, cantidad) {
    await db.run('UPDATE carrito SET cantidad = ? WHERE id = ?', [cantidad, id]);
  }

  async removeItem(id) {
    await db.run('DELETE FROM carrito WHERE id = ?', [id]);
  }

  async clearSession(sessionId) {
    await db.run('DELETE FROM carrito WHERE session_id = ?', [sessionId]);
  }

  async getTotal(sessionId) {
    const row = await db.get(
      `SELECT COALESCE(SUM(c.cantidad * p.precio), 0) as total
      FROM carrito c
      JOIN productos p ON c.producto_id = p.id
      WHERE c.session_id = ?`,
      [sessionId]
    );
    return row ? row.total : 0;
  }
}

module.exports = new CarritoRepository();
