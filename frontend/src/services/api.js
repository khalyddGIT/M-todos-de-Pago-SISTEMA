const API = '/api';

async function request(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export const api = {
  productos: {
    listar: () => request('GET', '/productos'),
    obtener: (id) => request('GET', `/productos/${id}`),
    crear: (data) => request('POST', '/productos', data),
    actualizar: (id, data) => request('PUT', `/productos/${id}`, data),
    eliminar: (id) => request('DELETE', `/productos/${id}`)
  },
  carrito: {
    obtener: (sessionId) => request('GET', `/carrito?session_id=${sessionId}`),
    agregar: (sessionId, producto_id, cantidad) =>
      request('POST', '/carrito/agregar', { session_id: sessionId, producto_id, cantidad }),
    actualizar: (id, sessionId, cantidad) =>
      request('PUT', `/carrito/actualizar/${id}`, { session_id: sessionId, cantidad }),
    eliminar: (id, sessionId) =>
      request('DELETE', `/carrito/eliminar/${id}?session_id=${sessionId}`),
    limpiar: (sessionId) =>
      request('POST', '/carrito/limpiar', { session_id: sessionId })
  },
  pedidos: {
    listar: (sessionId) => request('GET', `/pedidos?session_id=${sessionId}`),
    listarTodos: () => request('GET', '/pedidos'),
    obtener: (id) => request('GET', `/pedidos/${id}`),
    generar: (sessionId) => request('POST', '/pedidos/generar', { session_id: sessionId }),
    actualizarEstado: (id, estado) => request('PATCH', `/pedidos/${id}/estado`, { estado })
  },
  pagos: {
    metodos: () => request('GET', '/pagos/metodos'),
    procesar: (pedido_id, metodo) =>
      request('POST', '/pagos/procesar', { pedido_id, metodo }),
    paypalCapture: (paypal_order_id) =>
      request('POST', '/pagos/paypal/capture', { paypal_order_id })
  }
};
