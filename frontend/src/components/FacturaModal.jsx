import React from 'react';

export default function FacturaModal({ pedido, isOpen, onClose }) {
  if (!isOpen || !pedido) return null;

  const items = pedido.items || [];
  const subtotal = pedido.total ? pedido.total / 1.18 : 0;
  const igv = pedido.total ? pedido.total - subtotal : 0;
  const total = pedido.total || 0;

  const handlePrint = () => {
    window.print();
  };

  const serieFactura = `F001-${String(pedido.id).padStart(6, '0')}`;
  const fechaEmision = pedido.createdAt ? new Date(pedido.createdAt).toLocaleString('es-PE') : new Date().toLocaleString('es-PE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-350" onClick={e => e.stopPropagation()}>
        
        {/* Cabecera modal superior con botones de acción */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-heading font-black text-xs text-slate-900 uppercase tracking-widest">Comprobante SUNAT</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-indigo-650/15 btn-tactile">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir comprobante</span>
            </button>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors btn-tactile">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* FACTURA IMPRIMIBLE */}
        <div className="p-8 space-y-6 text-slate-800" id="factura-printable">
          
          {/* Encabezado Principal de la Factura */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md">
                  PF
                </div>
                <span className="font-heading font-black text-lg text-slate-900 tracking-wider">PAGOFLEX SYSTEMS S.A.C.</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">RUC: 20609876541</p>
              <p className="text-[11px] text-slate-505 mt-0.5">Av. Javier Prado Este 456, San Isidro, Lima - Perú</p>
              <p className="text-[11px] text-slate-505 mt-0.5">facturacion@pagoflex.pe | +51 987 654 321</p>
            </div>

            {/* Recuadro RUC y Serie SUNAT */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 text-center min-w-[210px] shadow-sm">
              <p className="font-mono font-black text-xs text-slate-700 uppercase tracking-widest">R.U.C. 20609876541</p>
              <h4 className="font-heading font-black text-[11px] text-indigo-600 uppercase tracking-widest my-1.5">
                FACTURA ELECTRÓNICA
              </h4>
              <p className="font-mono font-black text-base text-slate-950 tracking-wider">{serieFactura}</p>
            </div>
          </div>

          {/* Información del Cliente & Estado de Pago */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200/60 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Adquiriente:</p>
              <p className="font-black text-slate-900 text-sm">Cliente General / Pago Confirmado</p>
              <p className="text-slate-500 font-semibold mt-1">Condición de Pago: Contado (Pasarela)</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Fecha de Emisión:</p>
              <p className="font-bold text-slate-800">{fechaEmision}</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2">Medio de Pago:</p>
              <p className="font-black text-indigo-600 uppercase tracking-wider">{pedido.metodo_pago || 'Pago Electrónico'}</p>
            </div>
          </div>

          {/* Tabla de Productos / Ítems */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-50 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                  <th className="text-center py-3 px-3">Cant.</th>
                  <th className="text-left py-3 px-3">Descripción</th>
                  <th className="text-right py-3 px-3">P. Unitario</th>
                  <th className="text-right py-3 px-3">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="text-center font-bold py-3 px-3 tabular-numbers">{item.cantidad}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{item.nombre}</span>
                        {item.descripcion && <span className="text-[10px] text-slate-450 block mt-0.5">{item.descripcion}</span>}
                      </td>
                      <td className="text-right py-3 px-3 font-mono font-semibold text-slate-600 tabular-numbers">S/ {(item.precio_unitario || item.precio || 0).toFixed(2)}</td>
                      <td className="text-right py-3 px-3 font-mono font-black text-slate-900 tabular-numbers">
                        S/ {((item.precio_unitario || item.precio || 0) * item.cantidad).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400 italic">No hay ítems registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen de Montos */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-t border-slate-950 pt-5">
            
            {/* QR y Firma SUNAT */}
            <div className="flex items-center gap-4.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=20609876541|01|${serieFactura}|${igv.toFixed(2)}|${total.toFixed(2)}`}
                alt="QR SUNAT"
                className="w-16 h-16 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="text-[10px] text-slate-500 space-y-0.5 leading-relaxed font-semibold">
                <p className="font-black text-slate-800 uppercase tracking-wide">Representación Impresa</p>
                <p>Hash: {pedido.transaction_id || '9a8b7c6d5e4f'}</p>
                <p className="text-slate-400">Autorizado mediante resolución SUNAT</p>
              </div>
            </div>

            {/* Totales */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Op. Gravada:</span>
                <span className="font-mono font-bold tabular-numbers">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">I.G.V. (18%):</span>
                <span className="font-mono font-bold tabular-numbers">S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-slate-950 pt-3 text-sm">
                <span className="font-heading font-black text-slate-900 tracking-wider">TOTAL A PAGAR:</span>
                <span className="font-heading font-black text-indigo-650 text-xl font-mono tabular-numbers">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-5 border-t border-slate-100 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
            <p>¡Gracias por confiar en PagoFlex Systems!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
