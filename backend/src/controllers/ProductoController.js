const ProductoService = require('../services/ProductoService');

class ProductoController {
  async listar(req, res, next) {
    try {
      const productos = await ProductoService.listar();
      res.json(productos);
    } catch (err) {
      next(err);
    }
  }

  async obtener(req, res, next) {
    try {
      const producto = await ProductoService.obtenerPorId(parseInt(req.params.id));
      res.json(producto);
    } catch (err) {
      next(err);
    }
  }

  async crear(req, res, next) {
    try {
      const producto = await ProductoService.crear(req.body);
      res.status(201).json(producto);
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    try {
      const producto = await ProductoService.actualizar(parseInt(req.params.id), req.body);
      res.json(producto);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      const producto = await ProductoService.eliminar(parseInt(req.params.id));
      res.json(producto);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductoController();
