import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function CreditCardLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect x="2" y="8" width="44" height="32" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <rect x="2" y="18" width="44" height="10" fill="#dbeafe" />
      <rect x="6" y="22" width="8" height="2" rx="1" fill="#93c5fd" />
      <rect x="16" y="22" width="6" height="2" rx="1" fill="#93c5fd" />
      <rect x="6" y="27" width="14" height="2" rx="1" fill="#60a5fa" />
      <rect x="30" y="28" width="12" height="8" rx="2" fill="#1d4ed8" />
      <circle cx="36" cy="32" r="2" fill="#fef08a" />
      <text x="6" y="16" fontFamily="Arial" fontSize="5" fontWeight="bold" fill="#2563eb">VISA</text>
      <text x="34" y="15" fontFamily="Arial" fontSize="4" fill="#94a3b8">MC</text>
    </svg>
  );
}

function YapeLogo({ className }) {
  return (
    <svg className={className} viewBox="-35 0 510 270">
      <rect x="-35" y="0" fill="#9117A0" width="510" height="269" rx="24" />
      <circle cx="212" cy="99" r="140.5" fill="#00CCB4" />
      <path fill="#FFFFFF" d="M237.959,79.115c-0.372,0-0.751-0.091-1.103-0.283c-1.122-0.61-1.537-2.015-0.928-3.138l16.05-29.507c0.612-1.123,2.016-1.538,3.138-0.925c1.123,0.61,1.537,2.015,0.928,3.138l-16.05,29.507C239.575,78.677,238.78,79.115,237.959,79.115z"/>
      <path fill="#FFFFFF" d="M221.081,44.268c-0.963,0-1.896,0.093-2.767,0.27c-1.488,0.305-2.81,0.828-3.925,1.556c-1.126,0.731-2.052,1.678-2.748,2.813c-0.697,1.132-1.135,2.416-1.304,3.814c-0.153,1.257-0.103,2.419,0.145,3.457c0.253,1.057,0.766,2.041,1.522,2.924c0.742,0.868,1.755,1.68,3.011,2.417c1.237,0.728,2.783,1.414,4.594,2.041c1.733,0.622,3.221,1.205,4.419,1.732c1.169,0.517,2.104,1.057,2.785,1.607c0.647,0.524,1.097,1.097,1.334,1.699c0.239,0.606,0.308,1.342,0.205,2.185c-0.096,0.811-0.362,1.523-0.788,2.118c-0.431,0.597-0.991,1.087-1.666,1.453c-0.693,0.371-1.509,0.625-2.433,0.751c-0.464,0.062-0.952,0.094-1.45,0.094c-0.514,0-1.055-0.034-1.606-0.101c-1.146-0.138-1.791-0.4-2.767-0.798l-0.093-0.036c-1-0.406-1.645-0.961-2.325-1.592c-0.698-0.645-1.233-1.436-1.598-2.353c-0.364-0.92-0.523-1.99-0.472-3.187c0.073-0.642-0.11-1.273-0.517-1.783c-0.41-0.51-0.996-0.835-1.651-0.916c-0.1-0.013-0.205-0.019-0.306-0.019c-1.245,0-2.297,0.92-2.447,2.139v0.005l-0.001,0.006c-0.16,1.684-0.041,3.3,0.355,4.798c0.4,1.52,1.123,2.894,2.146,4.09c1.189,1.391,2.326,2.284,3.797,2.991c1.581,0.757,3.114,1.32,5.464,1.605c0.664,0.081,1.324,0.122,1.958,0.122c1.029,0,2.033-0.109,2.983-0.321c1.542-0.345,2.922-0.92,4.101-1.713c1.186-0.795,2.169-1.808,2.921-3.009c0.755-1.203,1.23-2.581,1.416-4.094c0.144-1.182,0.094-2.29-0.146-3.299c-0.234-1.001-0.613-1.917-1.122-2.719c-0.505-0.793-1.106-1.499-1.789-2.094c-0.675-0.591-1.4-1.094-2.152-1.496l-0.007-0.003l-0.006-0.002c-0.802-0.398-1.745-0.828-2.807-1.278c-1.058-0.448-2.303-0.944-3.696-1.472c-1.414-0.511-2.57-0.986-3.446-1.412c-0.857-0.415-1.526-0.843-1.991-1.265c-0.431-0.394-0.709-0.819-0.831-1.262c-0.13-0.472-0.154-1.037-0.077-1.679c0.166-1.372,0.853-2.388,2.103-3.106c0.958-0.55,2.153-0.83,3.55-0.83c0.566,0,1.17,0.047,1.794,0.138c2.555,0.379,5.26,2.834,5.225,5.886c-0.073,0.648,0.114,1.284,0.525,1.798c0.413,0.518,1.007,0.848,1.671,0.928c0.103,0.011,0.207,0.019,0.311,0.019c1.175,0,2.178-0.807,2.435-1.915l0.019-0.01l0.025-0.248c0.17-1.636,0.033-2.938-0.456-4.359c-0.428-1.229-0.776-1.687-1.418-2.518c-0.089-0.114-0.181-0.236-0.283-0.369c-0.811-1.065-1.672-1.797-2.971-2.529c-1.511-0.851-2.992-1.341-4.667-1.543C222.455,44.311,221.754,44.268,221.081,44.268L221.081,44.268z"/>
    </svg>
  );
}

function MercadoPagoLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 150 104" fill="none">
      <path fill="#0A0080" d="M150 49.027c0-26.944-33.685-48.87-75-48.87-41.501 0-75 21.926-75 48.87v2.787c0 28.616 29.404 51.843 75 51.843 45.968 0 75-23.227 75-51.843v-2.787Z"/>
      <path fill="#2ABCFF" d="M147.022 49.027c0 25.457-32.196 46.083-72.022 46.083-39.826 0-72.022-20.626-72.022-46.083C2.978 23.57 35.174 2.944 75 2.944c39.826.186 72.022 20.626 72.022 46.083Z"/>
      <path fill="#fff" d="M50.993 34.533s-.745.743-.373 1.487c1.117 1.486 4.653 2.23 8.189 1.486 2.047-.557 4.839-2.601 7.444-4.645 2.792-2.23 5.583-4.46 8.56-5.389 2.979-.93 4.84-.558 6.142-.186 1.49.372 2.978 1.3 5.584 3.345 5.024 3.716 24.751 20.997 28.101 23.97 2.792-1.3 15.075-6.503 31.638-10.22-1.117-8.919-6.514-17.095-14.702-23.784-11.353 4.831-25.31 7.247-39.082.557 0 0-7.444-3.53-14.702-3.345-10.794.186-15.447 5.017-20.472 9.849l-6.327 6.875Z"/>
    </svg>
  );
}

function PayPalLogo({ className }) {
  return (
    <svg className={className} viewBox="7.056 3 37.351 45">
      <path fill="#002991" d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z" />
      <path fill="#60CDFF" d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z" />
      <path fill="#008CFF" d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z" />
    </svg>
  );
}

function StripeLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 512 214" fill="none">
      <path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138-33.85 0-54.33 28.73-54.33 64.854 0 42.808 24.179 64.426 58.88 64.426 16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756 8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96 25.458 0 48.64-20.48 48.64-65.564-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968 12.942 0 21.902 14.506 21.902 33.137 0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395-.142 113.92c0 21.05 15.787 36.551 36.836 36.551 11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68 10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92 0 6.541-5.688 8.675-13.653 8.675-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106 29.582 0 49.92-14.648 49.92-40.106-.142-42.382-54.329-34.845-54.329-50.774"/>
    </svg>
  );
}

const methods = {
  STRIPE: {
    id: 'STRIPE',
    name: 'Stripe',
    subtitle: 'Tarjetas Internacionales & Google Pay',
    description: 'Procesamiento directo con la plataforma oficial de Stripe',
    badge: 'Internacional',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
    activeRing: 'border-indigo-600 bg-indigo-50/40 ring-4 ring-indigo-600/15',
    icon: <StripeLogo className="w-12 h-auto" />,
  },
  PAYPAL: {
    id: 'PAYPAL',
    name: 'PayPal Express',
    subtitle: 'Saldo PayPal & Tarjetas Globales',
    description: 'Protección al comprador garantizada por PayPal',
    badge: 'Protegido',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
    activeRing: 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-600/15',
    icon: <PayPalLogo className="w-8 h-8" />,
  },
  TARJETA_SIMULADO: {
    id: 'TARJETA_SIMULADO',
    name: 'Tarjeta Bancaria',
    subtitle: 'Visa, Mastercard, Diners & Amex',
    description: 'Procesamiento en tiempo real con cifrado de alta seguridad',
    badge: 'Instantáneo',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    btnBg: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25',
    activeRing: 'border-slate-900 bg-slate-50/80 ring-4 ring-slate-900/10',
    icon: <CreditCardLogo className="w-8 h-8" />,
  },
  YAPE_SIMULADO: {
    id: 'YAPE_SIMULADO',
    name: 'Yape / Plin',
    subtitle: 'Pago Móvil QR Inmediato en Perú',
    description: 'Transfiere directamente desde tu celular en 5 segundos',
    badge: 'Más Popular',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 font-black',
    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/25',
    activeRing: 'border-purple-600 bg-purple-50/50 ring-4 ring-purple-600/15',
    icon: <YapeLogo className="w-8 h-8" />,
  },
  MERCADO_PAGO: {
    id: 'MERCADO_PAGO',
    name: 'Mercado Pago',
    subtitle: 'Cuotas sin interés & Efectivo',
    description: 'Pasarela oficial respaldada por Mercado Libre',
    badge: 'Latinoamérica',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    btnBg: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25',
    activeRing: 'border-sky-500 bg-sky-50/40 ring-4 ring-sky-500/15',
    icon: <MercadoPagoLogo className="w-8 h-8" />,
  },
};

export default function Checkout({ sessionId, onOrderCompleted }) {
  const [selectedMethod, setSelectedMethod] = useState('PAYPAL');
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [pendingOrder, setPendingOrder] = useState(null);
  const [result, setResult] = useState(null);

  // Formulario simulación tarjeta
  const [cardForm, setCardForm] = useState({
    numero: '4557 8812 9901 3456',
    titular: 'JUAN PEREZ ALVAREZ',
    vencimiento: '12/28',
    cvv: '884',
  });

  // Estado Yape
  const [yapeOpCode, setYapeOpCode] = useState('');

  const loadInitialData = async () => {
    try {
      setFetchingCart(true);
      const [cartData, ordersData] = await Promise.all([
        api.carrito.obtener(sessionId).catch(() => ({ items: [], subtotal: 0 })),
        api.pedidos.listar(sessionId).catch(() => [])
      ]);
      setCart(cartData);

      const activePending = ordersData.find(p => p.estado === 'PENDIENTE');
      setPendingOrder(activePending || null);
    } catch (e) {
      console.error('Error cargando checkout:', e);
    } finally {
      setFetchingCart(false);
    }
  };

  useEffect(() => {
    if (sessionId) loadInitialData();
  }, [sessionId]);

  const totalAmount = cart.items && cart.items.length > 0
    ? cart.subtotal
    : (pendingOrder ? pendingOrder.total : 0);

  const totalItemsCount = cart.items && cart.items.length > 0
    ? cart.items.reduce((acc, item) => acc + item.cantidad, 0)
    : (pendingOrder && pendingOrder.items ? pendingOrder.items.reduce((acc, item) => acc + item.cantidad, 0) : 0);

  const displayItems = cart.items && cart.items.length > 0
    ? cart.items
    : (pendingOrder ? pendingOrder.items : []);

  const handleProcessPayment = async () => {
    try {
      setLoading(true);
      let targetOrder = null;

      if (cart.items && cart.items.length > 0) {
        try {
          targetOrder = await api.pedidos.generar(sessionId);
        } catch (genErr) {
          if (pendingOrder) targetOrder = pendingOrder;
          else throw genErr;
        }
      } else if (pendingOrder) {
        targetOrder = pendingOrder;
      }

      if (!targetOrder || !targetOrder.id) {
        alert('Tu carrito está actualmente vacío. Agrega productos desde la tienda antes de continuar.');
        setLoading(false);
        return;
      }

      const res = await api.pagos.procesar(targetOrder.id, selectedMethod);

      if (selectedMethod === 'STRIPE' && res.url) {
        window.location.href = res.url;
        return;
      }

      if (selectedMethod === 'PAYPAL' && res.approval_url) {
        window.location.href = res.approval_url;
        return;
      }

      if (selectedMethod === 'MERCADO_PAGO' && (res.init_point || res.sandbox_init_point)) {
        window.location.href = res.init_point || res.sandbox_init_point;
        return;
      }

      if (res.estado === 'PAGADO' || res.success) {
        setResult({ ...res, metodo: selectedMethod, pedidoId: targetOrder.id });
        setPendingOrder(null);
        setCart({ items: [], subtotal: 0 });
        if (onOrderCompleted) onOrderCompleted();
      } else {
        alert(res.message || 'El pago no pudo procesarse. Los productos se mantendrán en tu carrito.');
        if (onOrderCompleted) onOrderCompleted();
      }

    } catch (e) {
      alert('Error procesando pago: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProducts = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (fetchingCart) {
    return (
      <div className="max-w-5xl mx-auto my-8 p-8 bg-slate-100/60 rounded-3xl animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-5 h-80 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Estado Vacío
  if ((!cart.items || cart.items.length === 0) && !pendingOrder && !result) {
    return (
      <div className="max-w-lg mx-auto my-12 text-center font-body">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <div>
            <h3 className="font-heading font-black text-2xl text-slate-900 leading-tight">Tu carrito está actualmente vacío</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">Selecciona productos desde la tienda para proceder con la pasarela de pago.</p>
          </div>

          <button 
            onClick={handleGoToProducts}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 btn-tactile">
            Volver a la Tienda a Seleccionar Productos
          </button>
        </div>
      </div>
    );
  }

  const currentMethod = methods[selectedMethod];

  return (
    <div className="max-w-5xl mx-auto my-8 font-body">
      
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PANEL IZQUIERDO: ELECCIÓN DE PASARELA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Header de Pasarela */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-2xl text-slate-900 leading-tight">
                      Pasarela de Pagos
                    </h2>
                    <p className="text-xs font-medium text-slate-400">
                      Selecciona la pasarela con la que deseas abonar
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SSL 256-Bit
                </span>
              </div>

              {/* Lista de las 5 Pasarelas Disponibles */}
              <div className="space-y-3">
                {Object.values(methods).map((m) => {
                  const isSelected = selectedMethod === m.id;

                  return (
                    <div 
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 btn-tactile ${
                        isSelected 
                          ? m.activeRing 
                          : 'border-slate-200/80 hover:border-slate-300 bg-white'
                      }`}>
                      
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Logo Box */}
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-2">
                          {m.icon}
                        </div>

                        {/* Texto e info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-tight">
                              {m.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${m.badgeColor}`}>
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">
                            {m.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Radio Selector Pill */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* VISTA DINÁMICA DE DETALLES SEGÚN MÉTODO ELEGIDO */}
              <div className="pt-2">
                
                {/* STRIPE */}
                {selectedMethod === 'STRIPE' && (
                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white p-3 shadow-md border border-indigo-100 flex items-center justify-center">
                      <StripeLogo className="w-full h-auto" />
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-heading font-black text-base text-slate-900">Pasarela Oficial Stripe</h5>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                        Serás redirigido al portal oficial seguro de Stripe para procesar tarjetas de crédito o débito internacional.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-2 border-t border-indigo-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-indigo-700">
                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Cifrado SSL 256-bit
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-indigo-700">
                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        3D Secure 2.0
                      </span>
                    </div>
                  </div>
                )}

                {/* PAYPAL */}
                {selectedMethod === 'PAYPAL' && (
                  <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80 text-center space-y-3">
                    <PayPalLogo className="w-10 h-10 mx-auto" />
                    <div>
                      <h5 className="font-heading font-black text-base text-blue-950">PayPal Express Checkout</h5>
                      <p className="text-xs text-blue-700 font-medium leading-relaxed max-w-sm mx-auto mt-1">
                        Ingresa a tu cuenta de PayPal para autorizar la compra con total protección al comprador y confirmación inmediata.
                      </p>
                    </div>
                  </div>
                )}

                {/* TARJETA SIMULADA CON MAQUETA INTERACTIVA */}
                {selectedMethod === 'TARJETA_SIMULADO' && (
                  <div className="space-y-4">
                    
                    {/* Tarjeta de Crédito Visual */}
                    <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-5 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-700">
                      <div className="flex justify-between items-center z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Visa Gold / Mastercard</span>
                        <span className="font-heading font-black text-sm tracking-wider text-amber-400">PAGOFLEX</span>
                      </div>
                      <div className="font-mono text-lg font-black tracking-widest z-10">
                        {cardForm.numero || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end z-10 text-xs font-mono">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-slate-400 block">Titular</span>
                          <span className="font-bold text-slate-200">{cardForm.titular || 'NOMBRE TITULAR'}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-slate-400 block">Vence</span>
                          <span className="font-bold text-slate-200">{cardForm.vencimiento || 'MM/AA'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Formulario */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Nombre del Titular</label>
                        <input 
                          type="text"
                          value={cardForm.titular}
                          onChange={e => setCardForm({ ...cardForm, titular: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Número de Tarjeta</label>
                        <input 
                          type="text"
                          value={cardForm.numero}
                          onChange={e => setCardForm({ ...cardForm, numero: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Vencimiento</label>
                          <input 
                            type="text"
                            value={cardForm.vencimiento}
                            onChange={e => setCardForm({ ...cardForm, vencimiento: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">CVV</label>
                          <input 
                            type="password"
                            maxLength="4"
                            value={cardForm.cvv}
                            onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* YAPE / PLIN */}
                {selectedMethod === 'YAPE_SIMULADO' && (
                  <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-center space-y-4">
                    <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-md border border-purple-200 flex items-center justify-center">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=YAPE-PAGOFLEX-PERU-987654321" 
                        alt="QR Yape PagoFlex"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <h5 className="font-heading font-black text-base text-purple-950">Escanea el QR con Yape o Plin</h5>
                      <p className="text-xs text-purple-700 font-medium mt-1">Número PagoFlex: <span className="font-mono font-black text-purple-900">987 654 321</span></p>
                    </div>
                    <div className="max-w-xs mx-auto space-y-1.5 text-left bg-white p-3.5 rounded-xl border border-purple-100">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-purple-900">Número de Operación (6 Dígitos):</label>
                      <input 
                        type="text"
                        placeholder="Ej: 892104"
                        value={yapeOpCode}
                        onChange={e => setYapeOpCode(e.target.value)}
                        className="w-full px-3 py-2 text-center text-sm font-mono font-bold rounded-lg border border-purple-200 bg-purple-50/50 uppercase outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* MERCADO PAGO */}
                {selectedMethod === 'MERCADO_PAGO' && (
                  <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-200/80 text-center space-y-3">
                    <MercadoPagoLogo className="w-16 h-16 mx-auto" />
                    <div>
                      <h5 className="font-heading font-black text-base text-sky-950">Mercado Pago Checkout Oficial</h5>
                      <p className="text-xs text-sky-700 font-medium leading-relaxed max-w-sm mx-auto mt-1">
                        Paga en cuotas fijas o con saldo de tu cuenta de Mercado Pago con redirección segura Sandbox.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Botón Principal de Pago */}
              <button 
                onClick={handleProcessPayment}
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-3 btn-tactile ${currentMethod?.btnBg}`}>
                {loading ? (
                  <span className="animate-pulse">Conectando con la pasarela...</span>
                ) : (
                  <>
                    <span>Pagar S/ {totalAmount.toFixed(2)} con {currentMethod?.name}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* PANEL DERECHO: RESUMEN DE COMPRA */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-28 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-heading font-black text-lg text-slate-900">
                  Resumen de Compra
                </h3>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {totalItemsCount} Producto{totalItemsCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Lista de Productos */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {displayItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100/80 gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0 flex items-center justify-center">
                      <img 
                        src={item.imagen || item.image || '/images/backpack.jpg'} 
                        alt={item.nombre} 
                        className="max-h-full max-w-full object-contain rounded"
                        onError={(e) => { e.target.src = '/images/backpack.jpg'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 truncate">{item.nombre || 'Producto'}</p>
                      <p className="text-[10px] text-slate-400">Cant: {item.cantidad} &times; S/ {(item.precio_unitario || item.precio || 0).toFixed(2)}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                      S/ {((item.cantidad || 1) * (item.precio_unitario || item.precio || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desglose de Precios */}
              <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 text-slate-500 font-medium">
                <div className="flex justify-between">
                  <span>Pasarela elegida:</span>
                  <span className="font-bold text-slate-900">{currentMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío a domicilio:</span>
                  <span className="font-bold text-emerald-600 font-mono">GRATIS</span>
                </div>
                <div className="flex justify-between">
                  <span>IGV (18% Incluido):</span>
                  <span className="font-bold text-slate-900 font-mono">S/ {(totalAmount * 0.18).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-slate-150">
                  <span className="font-heading font-black text-sm text-slate-900 uppercase">Monto Total</span>
                  <span className="font-heading font-black text-2xl text-slate-900 font-mono">
                    S/ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Garantía de Seguridad */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <p className="text-[11px] font-bold text-slate-600 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Garantía de reembolso oficial en 30 días</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* COMPROBANTE DE COMPRA PROCESADO */
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-lg mx-auto border border-slate-200/80 font-body">
          <div className={`p-8 text-center border-b border-slate-100 ${result.success ? 'bg-emerald-50/50' : 'bg-rose-50/50'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-sm ${
              result.success ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-rose-100 border-rose-200 text-rose-600'
            }`}>
              {result.success ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h3 className={`font-heading font-black text-2xl tracking-tight leading-none ${result.success ? 'text-emerald-950' : 'text-rose-950'}`}>
              {result.success ? '¡Pago Confirmado!' : 'Pago Fallido'}
            </h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {result.message || 'Tu orden ha sido registrada en el sistema.'}
            </p>
          </div>

          <div className="p-8 space-y-5">
            <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Pasarela Usada</span>
                <span className="font-bold text-slate-900">{methods[result.metodo]?.name || result.metodo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">ID Transacción</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{result.transaction_id || 'tx_882910'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">N° Pedido ID</span>
                <span className="font-mono font-bold text-slate-800">#{result.pedidoId}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Monto Total Pagado</span>
                <span className="font-heading font-black text-lg text-blue-600 font-mono">S/ {(result.monto || totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleGoToProducts}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 btn-tactile">
              Volver a la Tienda
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
