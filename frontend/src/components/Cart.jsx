import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function PaypalSmallIcon({ active }) {
  return (
    <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .761-.645h6.706c2.81 0 4.965.656 6.07 1.844 1.107 1.189 1.341 2.87.662 4.757-.756 2.095-2.222 3.65-4.13 4.38-1.168.448-2.58.645-4.2.645h-2.18l-1.557 6.636zm2.34-9.988h2.09c2.316 0 4.148-.737 4.793-2.527.56-1.555.226-2.656-.888-3.21-.692-.345-1.745-.494-3.132-.494H7.957l-1.34 8.231h2.799z"/>
    </svg>
  );
}

function StripeSmallIcon({ active }) {
  return (
    <svg className={`w-5 h-5 ${active ? 'text-[#635BFF]' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.98 11.13c0-1.12.91-1.6 2.45-1.6 1.77 0 3.73.54 5.22 1.35V6.15c-1.66-.66-3.41-.95-5.22-.95-4.57 0-7.62 2.37-7.62 6.07 0 5.76 7.9 4.84 7.9 7.33 0 1.25-.97 1.67-2.63 1.67-2.09 0-4.41-.75-6.09-1.68v4.8c1.88.82 3.91 1.21 6.09 1.21 4.78 0 7.85-2.31 7.85-6.19-.01-6.13-7.95-5.06-7.95-7.28z"/>
    </svg>
  );
}

function CardSmallIcon() {
  return (
    <div className="flex items-center -space-x-1">
      <div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90" />
      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 opacity-90" />
    </div>
  );
}

function YapeSmallIcon() {
  return (
    <span className="w-5 h-5 rounded-md bg-purple-700 text-teal-300 font-black text-[9px] flex items-center justify-center">
      Y
    </span>
  );
}

function MercadoPagoSmallIcon({ active }) {
  return (
    <span className={`w-5 h-5 rounded-md ${active ? 'bg-sky-500 text-white' : 'bg-slate-300 text-slate-600'} font-black text-[8px] flex items-center justify-center tracking-tighter`}>
      MP
    </span>
  );
}

export default function Cart({ sessionId, onCartUpdate, onProceedToCheckout }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState(null);
  const [selectedPaymentPill, setSelectedPaymentPill] = useState('PAYPAL');

  const load = async () => {
    try {
      const data = await api.carrito.obtener(sessionId);
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (sessionId) load(); }, [sessionId]);

  const handleUpdate = async (itemId, cantidad) => {
    if (cantidad < 1) return;
    try {
      await api.carrito.actualizar(itemId, sessionId, cantidad);
      load();
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await api.carrito.eliminar(itemId, sessionId);
      load();
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleClear = async () => {
    try {
      await api.carrito.limpiar(sessionId);
      load();
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'PAGOFLEX10' || couponCode.toUpperCase() === 'PROMO2026') {
      setAppliedDiscount(cart.subtotal * 0.1);
      setCouponMsg({ type: 'success', text: '¡Cupón de 10% de descuento aplicado!' });
    } else {
      setCouponMsg({ type: 'error', text: 'Cupón no válido. Prueba con PAGOFLEX10' });
    }
  };

  const handleGoToProducts = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const deliveryFee = cart.subtotal >= 199 || cart.items.length === 0 ? 0 : 15;
  const tax = cart.subtotal * 0.18;
  const total = Math.max(0, cart.subtotal - appliedDiscount + deliveryFee);

  const paymentOptions = [
    { id: 'PAYPAL', label: 'PayPal', icon: <PaypalSmallIcon active={selectedPaymentPill === 'PAYPAL'} /> },
    { id: 'STRIPE', label: 'Stripe', icon: <StripeSmallIcon active={selectedPaymentPill === 'STRIPE'} /> },
    { id: 'TARJETA_SIMULADO', label: 'Tarjeta', icon: <CardSmallIcon /> },
    { id: 'YAPE_SIMULADO', label: 'Yape / Plin', icon: <YapeSmallIcon /> },
    { id: 'MERCADO_PAGO', label: 'Mercado Pago', icon: <MercadoPagoSmallIcon active={selectedPaymentPill === 'MERCADO_PAGO'} /> },
  ];

  if (loading) return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-slate-100/60 rounded-3xl animate-pulse">
      <div className="h-8 bg-slate-200 rounded-xl w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-36 bg-slate-200 rounded-3xl" />
          <div className="h-48 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto my-8 font-body">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: CARRITO DE COMPRAS */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* Header principal */}
          <div className="flex items-center justify-between">
            <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
              Carrito de Compras
            </h1>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {cart.items.length} Producto{cart.items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Encabezados de Tabla / Lista */}
          <div className="grid grid-cols-12 text-[11px] font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
            <div className="col-span-6 sm:col-span-6">Producto</div>
            <div className="col-span-3 sm:col-span-3 text-center">Cantidad</div>
            <div className="col-span-3 sm:col-span-3 text-right">Precio</div>
          </div>

          {/* Lista de Productos o Estado Vacío */}
          {cart.items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900">Tu carrito está actualmente vacío</h3>
                <p className="text-xs text-slate-500 mt-1">Explora nuestra tienda para agregar productos a tu carrito de compras.</p>
              </div>
              <button 
                onClick={handleGoToProducts}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all btn-tactile">
                Explorar Tienda
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow">
                  
                  {/* Producto Info + Imagen */}
                  <div className="col-span-6 sm:col-span-6 flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shrink-0">
                      <img 
                        src={item.imagen || item.image || '/images/backpack.jpg'} 
                        alt={item.nombre} 
                        className="max-h-full max-w-full object-contain rounded-md"
                        onError={(e) => { e.target.src = '/images/backpack.jpg'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading font-black text-slate-900 text-sm leading-snug line-clamp-2">
                        {item.nombre}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Color: <span className="text-slate-600 font-semibold">{item.descripcion || 'Estándar'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Selector de Cantidad Pill */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-center shrink-0">
                    <div className="bg-slate-100/80 rounded-xl px-2 py-1 flex items-center gap-2 border border-slate-200/60 shadow-inner">
                      <button 
                        onClick={() => handleUpdate(item.id, Math.max(1, item.cantidad - 1))}
                        disabled={item.cantidad <= 1}
                        className="w-6 h-6 rounded-lg text-slate-600 font-bold hover:bg-white flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        &minus;
                      </button>
                      <span className="font-bold text-slate-900 text-xs px-1 min-w-[1.25rem] text-center tabular-numbers">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => handleUpdate(item.id, item.cantidad + 1)}
                        className="w-6 h-6 rounded-lg text-slate-600 font-bold hover:bg-white flex items-center justify-center text-xs transition-colors">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Precio + Botón Eliminar */}
                  <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-3 shrink-0">
                    <span className="font-heading font-black text-slate-900 text-base font-mono tabular-numbers">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-slate-350 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar producto">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Botones Inferiores Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={handleGoToProducts}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver a la Tienda</span>
            </button>

            {cart.items.length > 0 && (
              <button 
                onClick={handleClear}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-red-500/20 transition-all btn-tactile">
                Vaciar Carrito
              </button>
            )}
          </div>

        </div>

        {/* COLUMNA DERECHA: SIDEBAR DE 3 TARJETAS */}
        <div className="lg:col-span-4 space-y-6">

          {/* TARJETA 1: CÓDIGO DE DESCUENTO */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-black text-base text-slate-900">
              Código de Descuento
            </h3>

            <form onSubmit={handleApplyCoupon} className="space-y-3">
              <input 
                type="text"
                placeholder="Ingresa tu código de descuento"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs font-medium placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
              />

              <button 
                type="submit"
                className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-black rounded-xl text-xs uppercase tracking-wider transition-colors btn-tactile">
                Aplicar Cupón
              </button>
            </form>

            {couponMsg && (
              <p className={`text-[11px] font-bold ${couponMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* TARJETA 2: RESUMEN DEL PEDIDO */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading font-black text-base text-slate-900">
              Resumen del Pedido
            </h3>

            <div className="space-y-3 text-xs font-medium text-slate-500">
              <div className="flex justify-between items-center">
                <span>Descuento</span>
                <span className="font-bold text-slate-900 font-mono">
                  S/ {appliedDiscount > 0 ? appliedDiscount.toFixed(2) : '0.00'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Envío a Domicilio</span>
                <span className="font-bold text-slate-900 font-mono">
                  {deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>IGV (18% Incluido)</span>
                <span className="font-bold text-slate-900 font-mono">
                  S/ {tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-slate-150">
                <span className="text-sm font-black text-slate-900">Total a Pagar</span>
                <span className="font-heading font-black text-2xl text-slate-900 font-mono tabular-numbers">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* TARJETA 3: MÉTODOS DE PAGO DISPONIBLES */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base text-slate-900">
                Método de Pago
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {paymentOptions.length} Pasarelas
              </span>
            </div>

            {/* Píldoras con los 5 Métodos de Pago Reales del Sistema */}
            <div className="grid grid-cols-5 gap-1.5">
              {paymentOptions.map((opt) => {
                const isSelected = selectedPaymentPill === opt.id;
                return (
                  <button 
                    key={opt.id}
                    type="button"
                    title={opt.label}
                    onClick={() => setSelectedPaymentPill(opt.id)}
                    className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 shadow-sm scale-105' 
                        : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
                    }`}>
                    {opt.icon}
                  </button>
                );
              })}
            </div>

            {/* Indicador del método seleccionado */}
            <div className="text-[11px] font-bold text-slate-500 text-center bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100">
              Pasarela seleccionada: <span className="text-blue-600 font-black">{paymentOptions.find(p => p.id === selectedPaymentPill)?.label}</span>
            </div>

            {/* Botón Principal Proceder al Pago */}
            <button 
              onClick={onProceedToCheckout}
              disabled={cart.items.length === 0}
              className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 transition-all btn-tactile ${
                cart.items.length === 0 ? 'opacity-50 cursor-not-allowed shadow-none hover:bg-blue-600' : ''
              }`}>
              Proceder al Pago
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
