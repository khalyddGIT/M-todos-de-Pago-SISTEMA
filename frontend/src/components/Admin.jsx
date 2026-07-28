import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import FacturaModal from './FacturaModal';

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-100/80 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function StatCard({ label, value, icon, color, change }) {
  return (
    <div className="glass-premium rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-slate-100/5 group-hover:scale-110 transition-transform duration-500 blur-xl pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center border shadow-inner`}>
          {icon}
        </div>
        {change && (
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
            change === 'PAGADO' || change === 'En vivo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/55' : 
            change === 'PENDIENTE' ? 'bg-amber-50 text-amber-600 border border-amber-100/55' :
            'bg-indigo-50 text-indigo-600 border border-indigo-100/55'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="font-heading text-2xl font-black text-slate-905 mt-1.5 tabular-numbers">{value}</p>
      </div>
    </div>
  );
}

function ProductFormModal({ isOpen, onClose, product, onSaved }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre || product.title || '',
        descripcion: product.descripcion || product.description || '',
        precio: String(product.precio || product.price || ''),
        stock: String(product.stock !== undefined ? product.stock : ''),
        categoria: product.categoria || product.category || '',
        imagen: product.imagen || product.image || ''
      });
    } else {
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        categoria: form.categoria,
        imagen: form.imagen
      };
      if (product) {
        await api.productos.actualizar(product.id, data);
      } else {
        await api.productos.crear(data);
      }
      onSaved();
      onClose();
    } catch (e) {
      alert('Error al guardar el producto: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/40">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900 leading-none">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Detalles del catálogo de inventario</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors btn-tactile">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Producto</label>
            <input placeholder="Ej. Mochila Fjallraven Kanken" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Categoría</label>
              <input placeholder="tecnología, calzado" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">URL Imagen</label>
              <input placeholder="/images/backpack.jpg" value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Descripción</label>
            <textarea rows="2" placeholder="Detalles y características principales..." value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Precio Oferta (S/)</label>
              <input placeholder="109.95" type="number" step="0.01" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Stock Disponible</label>
              <input placeholder="25" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 bg-white" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-250 text-slate-550 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors btn-tactile">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-500 shadow-md shadow-indigo-650/15 transition-all flex items-center justify-center gap-2 btn-tactile">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{saving ? 'Guardando...' : product ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-sm p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-inner">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <div>
          <h3 className="font-heading font-black text-lg text-slate-900 leading-none">{title}</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">{message}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-250 text-slate-550 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 btn-tactile">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 bg-rose-650 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-rose-500/10 btn-tactile">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

const statusConfig = {
  PENDIENTE: { bg: 'bg-amber-50 border border-amber-100/80 text-amber-705', label: 'PENDIENTE' },
  PAGADO: { bg: 'bg-emerald-50 border border-emerald-100/80 text-emerald-705', label: 'PAGADO' },
  RECHAZADO: { bg: 'bg-rose-50 border border-rose-100/80 text-rose-750', label: 'RECHAZADO' },
  CANCELADO: { bg: 'bg-slate-50 border border-slate-200 text-slate-550', label: 'CANCELADO' },
};

const subTabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard General',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    id: 'products', 
    label: 'Inventario de Productos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    id: 'orders', 
    label: 'Control de Pedidos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
];

export default function Admin() {
  const [subTab, setSubTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderFilter, setOrderFilter] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, o] = await Promise.all([
        api.productos.listar(),
        api.pedidos.listarTodos(),
      ]);
      setProducts(p);
      setOrders(o);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleUpdateOrderStatus = async (pedidoId, nuevoEstado) => {
    try {
      await api.pedidos.actualizarEstado(pedidoId, nuevoEstado);
      setToast({ type: 'success', message: `Pedido #${pedidoId} actualizado a ${nuevoEstado}` });
      setTimeout(() => setToast(null), 3000);
      loadData();
    } catch (e) {
      alert('Error al actualizar el estado: ' + e.message);
    }
  };

  const totalIngresos = orders.filter(o => o.estado === 'PAGADO').reduce((s, o) => s + (o.total || 0), 0);

  const stats = [
    {
      label: 'Catálogo de Productos',
      value: products.length,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-650',
      change: 'Activo',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Pedidos Procesados',
      value: orders.length,
      color: 'bg-blue-50 border-blue-100 text-blue-650',
      change: 'En vivo',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      label: 'Ingresos Aprobados',
      value: `S/ ${totalIngresos.toFixed(2)}`,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-650',
      change: 'PAGADO',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pendientes de Pago',
      value: orders.filter(o => o.estado === 'PENDIENTE').length,
      color: 'bg-amber-50 border-amber-100 text-amber-650',
      change: 'PENDIENTE',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const filteredOrders = orders.filter(o => !orderFilter || o.estado === orderFilter);

  const filteredProducts = products.filter(p => {
    const name = p.nombre || p.title || '';
    const cat = p.categoria || p.category || '';
    return name.toLowerCase().includes(productSearch.toLowerCase()) || cat.toLowerCase().includes(productSearch.toLowerCase());
  });

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await api.productos.eliminar(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (e) {
      alert('Error al eliminar producto: ' + e.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notificación */}
      {toast && (
        <div className="fixed top-24 right-8 z-50 px-5 py-3.5 rounded-2xl bg-slate-905 text-white text-xs font-bold shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <svg className="w-4 h-4 text-emerald-450 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Banner de Cabecera del Panel */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-350 text-[10px] font-bold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Panel de Control General
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Administración PagoFlex
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2.5 max-w-xl font-medium">
            Gestiona productos, cambia estados de pedidos en tiempo real e imprime facturas electrónicas oficiales.
          </p>
        </div>

        <button 
          onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-650 to-violet-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-650/15 hover:shadow-indigo-650/25 hover:scale-[1.01] transition-all flex items-center gap-2 shrink-0 btn-tactile">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear Producto</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-750 text-xs font-semibold">
          <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Cards de Métricas KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Navegación por Subpestañas del Admin */}
      <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3">
        {subTabs.map(t => {
          const isActive = subTab === t.id;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border btn-tactile ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-50'
              }`}>
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBPESTAÑA 1: DASHBOARD GENERAL */}
      {subTab === 'dashboard' && (
        <div className="glass-premium rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
          <div className="p-6 border-b border-slate-150 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900 leading-none">Últimos Pedidos</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Monitorea y edita el estado de facturación instantáneamente</p>
            </div>
            <button onClick={() => setSubTab('orders')} className="text-xs font-bold text-indigo-600 hover:text-indigo-500 btn-tactile">
              Ver todos los pedidos &rarr;
            </button>
          </div>

          {loading ? (
            <div className="p-6"><table className="w-full"><tbody>{[1, 2, 3].map(i => <SkeletonRow key={i} />)}</tbody></table></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-slate-450 font-bold uppercase">No hay pedidos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="text-left px-6 py-4">ID Pedido</th>
                    <th className="text-left px-6 py-4">Fecha / Hora</th>
                    <th className="text-left px-6 py-4">Estado</th>
                    <th className="text-left px-6 py-4">Cambiar Estado</th>
                    <th className="text-left px-6 py-4">Método</th>
                    <th className="text-right px-6 py-4">Total</th>
                    <th className="text-center px-6 py-4">Comprobante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 8).map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/40 transition-colors duration-300">
                      <td className="px-6 py-4 font-mono font-bold text-slate-950">#{o.id}</td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusConfig[o.estado]?.bg || 'bg-slate-100 text-slate-600'}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.estado}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 cursor-pointer shadow-sm">
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="PAGADO">PAGADO</option>
                          <option value="RECHAZADO">RECHAZADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{o.metodo_pago || 'Procesando'}</td>
                      <td className="px-6 py-4 text-right font-heading font-black text-indigo-650 text-sm font-mono tabular-numbers">S/ {o.total?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedFactura(o)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-755 text-xs font-bold transition-colors border border-indigo-200/50 btn-tactile">
                          Ver Factura
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBPESTAÑA 2: GESTIÓN DE PRODUCTOS */}
      {subTab === 'products' && (
        <div className="glass-premium rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 space-y-4">
          <div className="p-6 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-heading font-black text-lg text-slate-900 leading-none">Inventario de Productos</h3>

            <div className="flex items-center gap-3">
              <input 
                type="text"
                placeholder="Buscar producto..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-indigo-500 bg-white"
              />
              <button 
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm btn-tactile">
                + Crear
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6"><table className="w-full"><tbody>{[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}</tbody></table></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-slate-450 font-bold uppercase">No se encontraron productos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="text-left px-6 py-4">Producto</th>
                    <th className="text-left px-6 py-4">Categoría</th>
                    <th className="text-right px-6 py-4">Precio (S/)</th>
                    <th className="text-right px-6 py-4">Stock</th>
                    <th className="text-right px-6 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p, idx) => {
                    const imgUrl = p.imagen || p.image || '/images/backpack.jpg';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/40 transition-colors duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <img 
                              src={imgUrl} 
                              alt={p.nombre || p.title} 
                              className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100"
                              onError={(e) => { e.target.src = '/images/backpack.jpg'; }}
                            />
                            <div>
                              <span className="font-heading font-black text-slate-900 block">{p.nombre || p.title}</span>
                              <span className="text-[11px] text-slate-400 font-medium max-w-xs block truncate mt-0.5">{p.descripcion || p.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[9px]">
                          {p.categoria || p.category || 'General'}
                        </td>
                        <td className="px-6 py-4 text-right font-heading font-black text-slate-950 text-sm font-mono tabular-numbers">
                          S/ {(p.precio || p.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-rose-50 text-rose-600 border border-rose-100/50'
                          }`}>
                            {p.stock > 0 ? `${p.stock} unidades` : 'Agotado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 border border-transparent hover:border-indigo-100/50 transition-colors btn-tactile"
                              title="Editar">
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100/50 transition-colors btn-tactile"
                              title="Eliminar">
                              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBPESTAÑA 3: GESTIÓN DE PEDIDOS Y CAMBIO DE ESTADOS */}
      {subTab === 'orders' && (
        <div className="glass-premium rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
          <div className="p-6 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900 leading-none">Control de Estados</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Actualiza los estados de entrega y pagos del cliente</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['', 'PENDIENTE', 'PAGADO', 'RECHAZADO', 'CANCELADO'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setOrderFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border btn-tactile ${
                    orderFilter === s
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                  }`}>
                  {s || 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-6"><table className="w-full"><tbody>{[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}</tbody></table></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-slate-450 font-bold uppercase">No hay pedidos registrados{orderFilter ? ` en estado ${orderFilter}` : ''}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="text-left px-6 py-4">ID Pedido</th>
                    <th className="text-left px-6 py-4">Fecha</th>
                    <th className="text-left px-6 py-4">Estado</th>
                    <th className="text-left px-6 py-4">Cambiar Estado</th>
                    <th className="text-left px-6 py-4">Método</th>
                    <th className="text-right px-6 py-4">Total</th>
                    <th className="text-center px-6 py-4">Factura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/40 transition-colors duration-300">
                      <td className="px-6 py-4 font-mono font-bold text-slate-950">#{o.id}</td>
                      <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusConfig[o.estado]?.bg || 'bg-slate-100 text-slate-600'}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.estado}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-white text-slate-700 focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-650 shadow-sm cursor-pointer">
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="PAGADO">PAGADO</option>
                          <option value="RECHAZADO">RECHAZADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-black text-indigo-600">{o.metodo_pago || 'Pasarela'}</td>
                      <td className="px-6 py-4 text-right font-heading font-black text-slate-950 text-sm font-mono tabular-numbers">S/ {o.total?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedFactura(o)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-755 text-xs font-bold transition-colors border border-indigo-200/50 btn-tactile">
                          Ver Factura
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Formulario Producto */}
      <ProductFormModal
        isOpen={showProductForm}
        onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
        product={editingProduct}
        onSaved={loadData}
      />

      {/* Modal Confirmación Eliminar */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producto del Inventario"
        message={`¿Confirma que desea eliminar "${deleteTarget?.nombre || deleteTarget?.title}" del catálogo oficial?`}
      />

      {/* Modal Factura Electrónica */}
      <FacturaModal
        isOpen={!!selectedFactura}
        onClose={() => setSelectedFactura(null)}
        pedido={selectedFactura}
      />
    </div>
  );
}
