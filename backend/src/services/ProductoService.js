const ProductoRepository = require('../repositories/ProductoRepository');

class ProductoService {
  async listar() {
    const list = await ProductoRepository.findAll();
    return list.sort((a, b) => a.id - b.id);
  }

  async obtenerPorId(id) {
    const producto = await ProductoRepository.findById(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return producto;
  }

  normalizeData(rawData) {
    if (!rawData) return {};
    const nombre = rawData.nombre || rawData.title;
    const descripcion = rawData.descripcion !== undefined ? rawData.descripcion : (rawData.description || '');
    const precio = rawData.precio !== undefined ? rawData.precio : rawData.price;
    const stock = rawData.stock !== undefined ? rawData.stock : 20;
    const categoria = rawData.categoria || rawData.category || null;
    const imagen = rawData.imagen || rawData.image || null;

    let rating_rate = rawData.rating_rate;
    let rating_count = rawData.rating_count;

    if (rawData.rating && typeof rawData.rating === 'object') {
      if (rawData.rating.rate !== undefined) rating_rate = rawData.rating.rate;
      if (rawData.rating.count !== undefined) rating_count = rawData.rating.count;
    }

    return {
      nombre,
      descripcion,
      precio: precio !== undefined ? Number(precio) : undefined,
      stock: stock !== undefined ? Number(stock) : 20,
      categoria,
      imagen,
      rating_rate: rating_rate !== undefined ? Number(rating_rate) : 0,
      rating_count: rating_count !== undefined ? Number(rating_count) : 0
    };
  }

  async crear(rawData) {
    if (Array.isArray(rawData)) {
      const results = [];
      for (const item of rawData) {
        results.push(await this.crear(item));
      }
      return results;
    }

    const data = this.normalizeData(rawData);
    if (!data.nombre || !data.nombre.trim()) {
      const error = new Error('El nombre del producto es obligatorio');
      error.status = 400;
      throw error;
    }
    if (!data.precio || data.precio <= 0) {
      const error = new Error('El precio debe ser mayor a cero');
      error.status = 400;
      throw error;
    }
    if (data.stock === undefined || data.stock < 0) {
      const error = new Error('El stock debe ser un valor válido');
      error.status = 400;
      throw error;
    }

    return await ProductoRepository.create({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      categoria: data.categoria,
      imagen: data.imagen,
      rating_rate: data.rating_rate,
      rating_count: data.rating_count
    });
  }

  async actualizar(id, rawData) {
    await this.obtenerPorId(id);
    const data = this.normalizeData(rawData);
    if (data.precio !== undefined && data.precio <= 0) {
      const error = new Error('El precio debe ser mayor a cero');
      error.status = 400;
      throw error;
    }
    if (data.stock !== undefined && data.stock < 0) {
      const error = new Error('El stock no puede ser negativo');
      error.status = 400;
      throw error;
    }

    const producto = await ProductoRepository.update(id, data);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return producto;
  }

  async eliminar(id) {
    const producto = await ProductoRepository.delete(id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return producto;
  }
}

module.exports = new ProductoService();
