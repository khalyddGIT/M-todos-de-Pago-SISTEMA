const CarritoService = require('../services/CarritoService');

class CarritoController {
  async obtener(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.query.session_id;
      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere x-session-id en el header' });
      }
      const carrito = await CarritoService.obtener(sessionId);
      res.json(carrito);
    } catch (err) {
      next(err);
    }
  }

  async agregar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.body.session_id;
      const { producto_id, cantidad } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere session_id' });
      }
      if (!producto_id) {
        return res.status(400).json({ error: 'Se requiere producto_id' });
      }

      const carrito = await CarritoService.agregar(sessionId, producto_id, cantidad || 1);
      res.json(carrito);
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.body.session_id;
      const { cantidad } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere session_id' });
      }

      const carrito = await CarritoService.actualizarCantidad(
        parseInt(req.params.id), parseInt(cantidad), sessionId
      );
      res.json(carrito);
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.query.session_id;
      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere session_id' });
      }
      const carrito = await CarritoService.eliminarItem(parseInt(req.params.id), sessionId);
      res.json(carrito);
    } catch (err) {
      next(err);
    }
  }

  async limpiar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.body.session_id;
      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere session_id' });
      }
      const carrito = await CarritoService.limpiar(sessionId);
      res.json(carrito);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CarritoController();
