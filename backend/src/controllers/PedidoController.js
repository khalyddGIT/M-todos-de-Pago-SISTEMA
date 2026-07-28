const PedidoService = require('../services/PedidoService');

class PedidoController {
  async listar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.query.session_id;
      if (sessionId) {
        const pedidos = await PedidoService.listarPorSession(sessionId);
        return res.json(pedidos);
      }
      const pedidos = await PedidoService.listar();
      res.json(pedidos);
    } catch (err) {
      next(err);
    }
  }

  async obtener(req, res, next) {
    try {
      const pedido = await PedidoService.obtenerPorId(parseInt(req.params.id));
      res.json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async generar(req, res, next) {
    try {
      const sessionId = req.headers['x-session-id'] || req.body.session_id;
      if (!sessionId) {
        return res.status(400).json({ error: 'Se requiere session_id' });
      }
      const pedido = await PedidoService.generar(sessionId);
      res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  async actualizarEstado(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { estado } = req.body;
      if (!['PENDIENTE', 'PAGADO', 'RECHAZADO', 'CANCELADO'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido. Debe ser PENDIENTE, PAGADO, RECHAZADO o CANCELADO' });
      }
      const pedido = await PedidoService.actualizarEstado(id, estado);
      res.json(pedido);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PedidoController();
