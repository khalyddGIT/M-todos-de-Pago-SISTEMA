class MetodoPago {
  procesarPago(pedido) {
    throw new Error('Método abstracto - debe implementarse en la subclase');
  }

  getNombre() {
    throw new Error('Método abstracto - debe implementarse en la subclase');
  }
}

module.exports = MetodoPago;
