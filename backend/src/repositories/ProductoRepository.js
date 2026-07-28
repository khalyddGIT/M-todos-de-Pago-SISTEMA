const { db } = require('../config/database');

class ProductoRepository {
  async findAll() {
    return await db.all('SELECT * FROM productos ORDER BY id ASC');
  }

  async findById(id) {
    return await db.get('SELECT * FROM productos WHERE id = ?', [id]);
  }

  async create({ nombre, descripcion, precio, stock, categoria, imagen, rating_rate, rating_count }) {
    const result = await db.run(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen, rating_rate, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nombre,
        descripcion || '',
        precio,
        stock ?? 0,
        categoria || null,
        imagen || null,
        rating_rate ?? 0,
        rating_count ?? 0
      ]
    );
    return await this.findById(result.lastInsertRowid);
  }

  async update(id, { nombre, descripcion, precio, stock, categoria, imagen, rating_rate, rating_count }) {
    const producto = await this.findById(id);
    if (!producto) return null;

    await db.run(
      `UPDATE productos SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        stock = ?,
        categoria = ?,
        imagen = ?,
        rating_rate = ?,
        rating_count = ?,
        updatedAt = datetime('now')
       WHERE id = ?`,
      [
        nombre ?? producto.nombre,
        descripcion ?? producto.descripcion,
        precio ?? producto.precio,
        stock ?? producto.stock,
        categoria !== undefined ? categoria : producto.categoria,
        imagen !== undefined ? imagen : producto.imagen,
        rating_rate !== undefined ? rating_rate : producto.rating_rate,
        rating_count !== undefined ? rating_count : producto.rating_count,
        id
      ]
    );
    return await this.findById(id);
  }

  async delete(id) {
    const producto = await this.findById(id);
    if (!producto) return null;
    await db.run('DELETE FROM productos WHERE id = ?', [id]);
    return producto;
  }

  async updateStock(id, cantidad) {
    await db.run(
      `UPDATE productos SET stock = stock - ?, updatedAt = datetime('now') WHERE id = ?`,
      [cantidad, id]
    );
  }

  async hasStock(id, cantidad) {
    const producto = await this.findById(id);
    return producto && producto.stock >= cantidad;
  }
}

module.exports = new ProductoRepository();
