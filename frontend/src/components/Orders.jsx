import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import FacturaModal from './FacturaModal';

export default function Orders({ sessionId }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const load = async () => {
    try {
      const data = await api.pedidos.listar(sessionId);
      setPedidos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (sessionId) load(); }, [sessionId]);

  if (loading) return (
    <div className="glass-premium rounded-3xl p-6 border border-slate-200/80 animate-pulse max-w-4xl mx-auto my-8">
      <div className="h-6 bg-slate-100 rounded w-28 mb-6" />
      {[1, 2].map(i => (
        <div key={i} className="flex items-center justify-between p-3 mb-2 border-b border-slate-100 last:border-0">
          <div className="h-4 bg-slate-100 rounded w-24" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-black text-slate-900 leading-none">Mis Pedidos</h2>
          <p className="text-xs text-slate-400 mt-2 font-semibold">Historial de compras y comprobantes electrónicos</p>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-heading font-black text-slate-900 mb-1">No hay pedidos registrados</h3>
          <p className="text-xs text-slate-500">Realiza tu primera compra para generar tu factura digital.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map(p => {
            const isExpanded = expanded === p.id;
            return (
              <div key={p.id} className="glass-premium rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)}
                    className="flex-1 flex items-center gap-3.5 text-left btn-tactile">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                      p.estado === 'PAGADO' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      p.estado === 'RECHAZADO' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      p.estado === 'CANCELADO' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {p.estado === 'PAGADO' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-sm text-slate-900">Pedido #{p.id}</span>
                        <span className="text-[11px] text-slate-400 font-semibold">&middot; {p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-PE', {day:'numeric', month:'short'}) : 'Reciente'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-indigo-650 font-mono">S/ {p.total?.toFixed(2)}</span>
                        {p.metodo_pago && (
                          <span className="text-[11px] text-slate-500 font-semibold">&middot; {p.metodo_pago}</span>
                        )}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-3.5 shrink-0 justify-between sm:justify-start">
                    {/* Botón Ver Factura */}
                    <button 
                      onClick={() => setSelectedFactura(p)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-150 text-indigo-755 text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200/50 btn-tactile">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Ver Factura</span>
                    </button>

                    <button onClick={() => setExpanded(isExpanded ? null : p.id)} className="p-2 text-slate-400 hover:text-slate-600 btn-tactile">
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100/80 px-5 pb-5 bg-slate-50/40 transition-all duration-300">
                    {p.transaction_id && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs mt-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                        <p><span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Transacción ID:</span>{' '}
                          <span className="font-mono text-slate-800 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{p.transaction_id}</span>
                        </p>
                        {p.metodo_pago && (
                          <p><span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Método:</span>{' '}
                            <span className="text-indigo-600 font-black">{p.metodo_pago}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {p.items && p.items.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detalle de Productos:</p>
                        <div className="space-y-1.5">
                          {p.items.map(item => (
                            <div key={item.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-250/50 text-xs">
                              <div className="flex items-center gap-2.5">
                                <span className="w-5.5 h-5.5 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center text-[10px] font-black border border-indigo-100/40">
                                  {item.cantidad}
                                </span>
                                <span className="text-slate-800 font-semibold">{item.nombre}</span>
                              </div>
                              <span className="font-mono font-bold text-slate-900">
                                S/ {((item.precio_unitario || item.precio || 0) * item.cantidad).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Factura Electrónica */}
      <FacturaModal
        isOpen={!!selectedFactura}
        onClose={() => setSelectedFactura(null)}
        pedido={selectedFactura}
      />
    </div>
  );
}
