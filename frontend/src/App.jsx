import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import PaypalNotification from './components/PaypalNotification';
import Admin from './components/Admin';
import { api } from './services/api';

function generateSessionId() {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = 'ses-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('session_id', id);
  }
  return id;
}

// Obtener pestaña inicial desde el PATH de la URL
function getTabFromPath() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path === '/admin') return 'admin';
  if (path === '/carrito') return 'carrito';
  if (path === '/checkout') return 'checkout';
  if (path === '/pedidos') return 'pedidos';
  return 'productos';
}

const customerTabs = [
  { 
    id: 'productos', 
    label: 'Tienda', 
    path: '/',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ) 
  },
  { 
    id: 'carrito', 
    label: 'Carrito', 
    path: '/carrito',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ) 
  },
  { 
    id: 'checkout', 
    label: 'Pasarela', 
    path: '/checkout',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ) 
  },
  { 
    id: 'pedidos', 
    label: 'Pedidos', 
    path: '/pedidos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) 
  },
];

export default function App() {
  const [sessionId] = useState(generateSessionId);
  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [cartCount, setCartCount] = useState(0);
  const [cartKey, setCartKey] = useState(0);
  const [paypalMsg, setPaypalMsg] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Navegar a una pestaña y actualizar la URL
  const navigateToTab = (tabId) => {
    setPaypalMsg(null);
    setActiveTab(tabId);
    const pathMap = {
      productos: '/',
      carrito: '/carrito',
      checkout: '/checkout',
      pedidos: '/pedidos',
      admin: '/admin',
    };
    const targetPath = pathMap[tabId] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Escuchar cambios de navegación (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setPaypalMsg(null);
      setActiveTab(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypal = params.get('paypal');
    const stripe = params.get('stripe');
    const mp = params.get('mp');
    const order = params.get('order');
    const msg = params.get('msg');

    if (paypal) {
      if (paypal === 'success') {
        if (order) api.pedidos.actualizarEstado(order, 'PAGADO').catch(() => {});
        setPaypalMsg({ type: 'success', text: `¡Pago con PayPal completado! Pedido #${order}` });
      } else if (paypal === 'error') {
        setPaypalMsg({ type: 'error', text: `Error en PayPal: ${msg || 'Desconocido'}` });
      } else if (paypal === 'cancelled') {
        setPaypalMsg({ type: 'info', text: 'Pago con PayPal cancelado' });
      }
    } else if (stripe) {
      if (stripe === 'success') {
        if (order) api.pedidos.actualizarEstado(order, 'PAGADO').catch(() => {});
        setPaypalMsg({ type: 'success', text: `¡Pago con Stripe completado! Pedido #${order}` });
      } else if (stripe === 'error') {
        setPaypalMsg({ type: 'error', text: `Error en Stripe: ${msg || 'Desconocido'}` });
      } else if (stripe === 'cancelled') {
        setPaypalMsg({ type: 'info', text: 'Pago con Stripe cancelado' });
      }
    } else if (mp) {
      if (mp === 'success') {
        if (order) api.pedidos.actualizarEstado(order, 'PAGADO').catch(() => {});
        setPaypalMsg({ type: 'success', text: `¡Pago con Mercado Pago completado! Pedido #${order}` });
      } else if (mp === 'error') {
        setPaypalMsg({ type: 'error', text: `Error en Mercado Pago: ${msg || 'Desconocido'}` });
      } else if (mp === 'pending') {
        setPaypalMsg({ type: 'info', text: `Pago con Mercado Pago en proceso. Pedido #${order}` });
      }
    }

    if (paypal || stripe || mp) {
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, '', url);

      const timer = setTimeout(() => setPaypalMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const updateCartCount = async () => {
    try {
      const cart = await api.carrito.obtener(sessionId);
      setCartCount(cart.items.reduce((sum, i) => sum + i.cantidad, 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => { updateCartCount(); }, [sessionId, cartKey]);

  const handleCartUpdate = () => {
    setCartKey(k => k + 1);
    updateCartCount();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-body selection:bg-indigo-600 selection:text-white">
      
      {/* SECCIÓN PORTAL ADMIN EXCLUSIVO */}
      {activeTab === 'admin' ? (
        <div className="min-h-screen flex flex-col">
          <header className="bg-slate-950 text-white border-b border-slate-900 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white border border-indigo-500/20 shadow-lg shadow-indigo-650/20">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading font-black text-lg tracking-wider text-white">
                    PagoFlex <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest ml-1 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/60">Admin</span>
                  </span>
                  <span className="block text-[9px] font-semibold text-slate-500 mt-0.5">Ruta de control: /admin</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[9px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                
                <button 
                  onClick={() => navigateToTab('productos')}
                  className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-800 btn-tactile">
                  <svg className="w-4 h-4 text-indigo-455" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Ir a Tienda</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Admin />
          </main>

          <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
            PagoFlex Admin &middot; Gestión de Facturación
          </footer>
        </div>
      ) : (
        /* VISTA PÚBLICA DE LA TIENDA DE CLIENTES */
        <>
          {/* Header Fijo Glassmorphic */}
          <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
            scrolled 
              ? 'bg-white/80 shadow-md shadow-slate-950/5 backdrop-blur-md border-b border-slate-200/50 h-20' 
              : 'bg-[#f9fafb]/45 backdrop-blur-sm border-b border-slate-200/10 h-20'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              
              {/* Logo / Branding */}
              <button onClick={() => navigateToTab('productos')} className="flex items-center gap-3 group text-left btn-tactile">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/15 border border-indigo-500/20 group-hover:scale-102 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading font-black text-2xl tracking-tight text-slate-950 leading-none">
                    Pago<span className="text-indigo-650">Flex</span>
                  </span>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official Store</span>
                </div>
              </button>

              {/* BARRA NAVEGACIÓN ESTILO PREMIUM DOCK (Oculta en la vista principal Tienda) */}
              {activeTab !== 'productos' && (
                <nav className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-full border border-slate-900 shadow-xl shadow-slate-950/10">
                  {customerTabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button 
                        key={tab.id} 
                        onClick={() => navigateToTab(tab.id)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 btn-tactile ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15 scale-[1.01]'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}>
                        <span className={`transition-transform duration-300 ${isActive ? 'text-white scale-105' : 'text-slate-400'}`}>
                          {tab.icon}
                        </span>
                        <span>{tab.label}</span>

                        {tab.id === 'carrito' && cartCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black animate-pulse shadow-sm ml-1 tabular-numbers">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}

              {/* Acciones de la Cabecera */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigateToTab('carrito')} 
                  className="relative p-3 rounded-2xl bg-white border border-slate-205 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-150 transition-all btn-tactile">
                  <svg className="w-5 h-5 text-slate-650" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-black leading-none flex items-center justify-center shadow-md shadow-indigo-600/30 font-mono tabular-numbers pointer-events-none">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => navigateToTab('checkout')}
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-600/10 hover:scale-[1.01] transition-all btn-tactile">
                  <span>Pagar Ahora</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navegación Móvil Estilo Cápsula (Oculta en vista principal Tienda) */}
            {activeTab !== 'productos' && (
              <div className="lg:hidden flex items-center justify-around border-t border-slate-200/60 bg-white/95 backdrop-blur-md px-2 py-2">
                {customerTabs.map(tab => (
                  <button key={tab.id} onClick={() => navigateToTab(tab.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 btn-tactile ${
                      activeTab === tab.id ? 'text-indigo-605 bg-indigo-50/50 font-black' : 'text-slate-500'
                    }`}>
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.id === 'carrito' && cartCount > 0 && (
                      <span className="font-mono font-bold tabular-numbers">({cartCount})</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </header>

          {/* Marquee Ticker Anti-Slop (Minimalist & Restrained) */}
          <div className="mt-20 bg-slate-950 border-y border-slate-900/80 text-slate-400 py-2.5 overflow-hidden relative select-none">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="marquee-track">
              {/* Single repeated item track with restrained typography */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-8 shrink-0 px-4 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Envío Gratuito a todo el Perú en compras &gt; S/ 199</span>
                  </span>
                  <span className="text-slate-700">&bull;</span>

                  <span className="text-slate-300">Hasta 12 Cuotas Sin Interés</span>
                  <span className="text-slate-700">&bull;</span>

                  <span className="flex items-center gap-2 text-indigo-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Pasarelas Oficiales: Stripe, PayPal, Yape & Mercado Pago</span>
                  </span>
                  <span className="text-slate-700">&bull;</span>

                  <span>Cupón 10% OFF: <strong className="text-white font-mono">PAGOFLEX10</strong></span>
                  <span className="text-slate-700">&bull;</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Banner Section (Compacto & Elegante) */}
          {activeTab === 'productos' && (
            <section className="relative hero-gradient text-white py-8 lg:py-10 overflow-hidden border-b border-slate-900">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-indigo-650/10 blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[9px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                      Colección Premium 2026
                    </div>

                    <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight text-white uppercase">
                      Tecnología &amp;{' '}
                      <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                        Estilo Exclusivo
                      </span>
                    </h1>

                    <p className="text-slate-400 text-xs sm:text-sm max-w-[55ch] mx-auto lg:mx-0 font-medium leading-relaxed">
                      Productos seleccionados de la temporada con despacho rápido nacional y pasarela de pago certificada.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                      <button 
                        onClick={() => {
                          const el = document.getElementById('catalogo-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 btn-tactile">
                        <span>Explorar Catálogo</span>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                    </div>
                  </div>

                  {/* Imagen Destacada Compacta */}
                  <div className="lg:col-span-5 relative flex items-center justify-center">
                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500/20 via-slate-900 to-violet-500/10 p-4 border border-white/10 shadow-xl flex flex-col items-center justify-center group">
                      <img 
                        src="/images/headphones.jpg" 
                        alt="Audífonos Wireless Pro" 
                        className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-xl drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 z-10" 
                        onError={(e) => { e.target.src = '/images/headphones.jpg'; }}
                      />
                      <div className="absolute top-3 right-3 z-20 bg-indigo-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-400/30 text-[8px] font-black text-white uppercase tracking-widest shadow-md">
                        Destacado 2026
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-left">
                        <span className="text-[10px] font-bold text-white leading-tight truncate">Audífonos Pro Wireless</span>
                        <span className="text-[10px] font-mono font-black text-indigo-400 shrink-0 ml-1">S/ 299.00</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )}

          {/* Contenido Principal de Tienda */}
          <main className="flex-1 pb-16">
            {paypalMsg && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <PaypalNotification message={paypalMsg} onClose={() => setPaypalMsg(null)} />
              </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" key={activeTab}>
              {activeTab === 'productos' && <ProductList sessionId={sessionId} onAddToCart={handleCartUpdate} />}
              {activeTab === 'carrito' && <Cart sessionId={sessionId} onCartUpdate={handleCartUpdate} onProceedToCheckout={() => navigateToTab('checkout')} />}
              {activeTab === 'checkout' && <Checkout sessionId={sessionId} onOrderCompleted={handleCartUpdate} />}
              {activeTab === 'pedidos' && <Orders sessionId={sessionId} />}
            </div>
          </main>

          {/* Footer Elegante Estilo Premium */}
          <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Franja de Garantías Reubicadas en el Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-900 mb-10 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-heading text-sm font-black text-white">24 hrs</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Despacho Express Nacional</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-heading text-sm font-black text-white">Seguridad SSL</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pago 100% Encriptado</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-heading text-sm font-black text-white">Garantía Oficial</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">De Satisfacción</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                
                {/* Col 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white border border-indigo-500/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="font-heading font-black text-xl text-white">PagoFlex</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Plataforma de e-commerce y pasarelas de pago integradas. Entorno rápido, seguro y optimizado para transacciones electrónicas.
                  </p>
                </div>

                {/* Col 2 */}
                <div>
                  <h4 className="font-heading font-bold text-white text-[10px] uppercase tracking-widest mb-4">Navegación</h4>
                  <ul className="space-y-2.5 text-xs font-semibold">
                    <li><button onClick={() => navigateToTab('productos')} className="hover:text-indigo-400 transition-colors btn-tactile">Tienda principal</button></li>
                    <li><button onClick={() => navigateToTab('carrito')} className="hover:text-indigo-400 transition-colors btn-tactile">Carrito de compras</button></li>
                    <li><button onClick={() => navigateToTab('checkout')} className="hover:text-indigo-400 transition-colors btn-tactile">Pasarela de pago</button></li>
                    <li><button onClick={() => navigateToTab('pedidos')} className="hover:text-indigo-400 transition-colors btn-tactile">Mis compras</button></li>
                  </ul>
                </div>

                {/* Col 3 */}
                <div>
                  <h4 className="font-heading font-bold text-white text-[10px] uppercase tracking-widest mb-4">Integraciones</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">Stripe</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">PayPal</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">Yape</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">Plin</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">Mercado Pago</span>
                  </div>
                </div>

                {/* Col 4 */}
                <div>
                  <h4 className="font-heading font-bold text-white text-[10px] uppercase tracking-widest mb-4">Administración</h4>
                  <p className="text-xs text-slate-500 mb-3.5 font-semibold">
                    Ingreso exclusivo para administradores a la ruta directa del panel.
                  </p>
                  <button 
                    onClick={() => navigateToTab('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-650 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800 btn-tactile">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Ingresar a /admin</span>
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-550 font-semibold uppercase tracking-wider">
                &copy; {new Date().getFullYear()} PagoFlex Systems Inc. Todos los derechos reservados.
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
