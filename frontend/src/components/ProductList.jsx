import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm animate-pulse space-y-4">
      <div className="h-52 rounded-2xl bg-slate-100/90 w-full" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="h-5 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-slate-100 rounded w-24" />
        <div className="h-5 bg-slate-100 rounded w-16" />
      </div>
      <div className="h-12 bg-slate-100 rounded-2xl w-full" />
    </div>
  );
}

const formatCategoryName = (cat) => {
  if (!cat || cat === 'ALL') return 'Todos los Productos';
  const lower = cat.toLowerCase().trim();
  if (lower.includes("men's clothing") || lower === 'ropa') return 'Ropa de Varón';
  if (lower.includes("women's clothing")) return 'Ropa Femenina';
  if (lower.includes("electronics") || lower === 'tecnologia') return 'Tecnología';
  if (lower.includes("jewelery") || lower === 'joyeria') return 'Joyería';
  if (lower === 'audio') return 'Audio & Sonido';
  if (lower === 'almacenamiento') return 'Almacenamiento';
  if (lower === 'accesorios') return 'Accesorios';
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

export default function ProductList({ sessionId, onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [wishlist, setWishlist] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.productos.listar();
      setProductos(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const agregarAlCarrito = async (producto, e) => {
    if (e) e.stopPropagation();
    try {
      setAddingId(producto.id);
      await api.carrito.agregar(sessionId, producto.id, 1);
      setTimeout(() => setAddingId(null), 700);
      onAddToCart();
      showToast(`¡"${producto.nombre || producto.title}" añadido al carrito!`);
    } catch (err) {
      setAddingId(null);
      alert(err.message);
    }
  };

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        showToast('Producto guardado en tus Favoritos');
      }
      return next;
    });
  };

  // Categorías principales (Limitadas a 3 píldoras para mantener la barra limpia)
  const rawCategories = Array.from(new Set(productos.map(p => p.categoria || p.category).filter(Boolean)));
  const categories = ['ALL', ...rawCategories].slice(0, 3);

  // Filtrado y búsqueda
  const filteredProducts = productos.filter(p => {
    const cat = p.categoria || p.category;
    const matchesCategory = selectedCategory === 'ALL' || cat === selectedCategory;
    const name = p.nombre || p.title || '';
    const desc = p.descripcion || p.description || '';
    const matchesSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ordenamiento
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.precio || a.price || 0;
    const priceB = b.precio || b.price || 0;
    if (sortBy === 'PRICE_LOW') return priceA - priceB;
    if (sortBy === 'PRICE_HIGH') return priceB - priceA;
    if (sortBy === 'NAME') return (a.nombre || '').localeCompare(b.nombre || '');
    return a.id - b.id;
  });

  return (
    <div id="catalogo-section" className="py-6 font-body">
      
      {/* Toast Notification Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-bounce">
          <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
            ✓
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* BARRA DE FILTROS & BÚSQUEDA & ORDENAMIENTO */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
        
        {/* Píldoras de Categorías con Scroll Invisible */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'ALL' 
              ? productos.length 
              : productos.filter(p => (p.categoria || p.category) === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 btn-tactile ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}>
                <span>{formatCategoryName(cat)}</span>
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador & Dropdown Ordenamiento */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Buscador Limpio */}
          <div className="relative w-full sm:w-60">
            <input 
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs font-bold">
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Ordenamiento Estilizado */}
          <div className="relative">
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="pl-3.5 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer appearance-none">
              <option value="DEFAULT">Destacados</option>
              <option value="PRICE_LOW">Precio: Menor a Mayor</option>
              <option value="PRICE_HIGH">Precio: Mayor a Menor</option>
              <option value="NAME">Nombre (A-Z)</option>
            </select>
            <svg className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

        </div>

      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
          <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error cargando productos: {error}</span>
        </div>
      )}

      {/* REJILLA DE PRODUCTOS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-slate-900">No se encontraron productos</h3>
            <p className="text-slate-500 text-xs mt-1">No hay coincidencias para tu búsqueda o filtro seleccionado.</p>
          </div>
          <button 
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); setSortBy('DEFAULT'); }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md btn-tactile">
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((p) => {
            const imgUrl = p.imagen || p.image;
            const category = p.categoria || p.category || 'General';
            const price = p.precio || p.price || 0;
            const originalPrice = price * 1.15;
            const isWishlisted = wishlist.has(p.id);
            const inStock = (p.stock !== undefined ? p.stock : 10) > 0;

            return (
              <div 
                key={p.id} 
                onClick={() => setQuickViewProduct(p)}
                className="group bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-600/40 hover:shadow-xl hover:shadow-slate-950/5 transition-all duration-300 flex flex-col justify-between relative cursor-pointer">
                
                <div>
                  {/* Contenedor de Imagen */}
                  <div className="relative w-full h-56 bg-slate-50 rounded-2xl p-4 mb-4 flex items-center justify-center border border-slate-100/80 overflow-hidden group-hover:bg-slate-100/60 transition-colors">
                    
                    {/* Badge Descuento */}
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[9px] font-black bg-red-500 text-white uppercase tracking-wider shadow-sm">
                      -15% OFF
                    </span>

                    {/* Botón Favoritos */}
                    <button 
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className={`absolute top-3 right-3 z-10 p-2.5 rounded-xl backdrop-blur-md transition-all btn-tactile ${
                        isWishlisted 
                          ? 'bg-rose-50 border border-rose-200 text-rose-600' 
                          : 'bg-white/80 border border-slate-200/60 text-slate-400 hover:text-rose-500 hover:bg-white'
                      }`}
                      title="Guardar en Favoritos">
                      <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Imagen del Producto */}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.nombre || p.title}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg"
                        onError={(e) => {
                          if (e.target.src && !e.target.dataset.failed) {
                            e.target.dataset.failed = "true";
                            const fallbackMap = {
                              1: '/images/backpack.jpg',
                              2: '/images/mouse.jpg',
                              3: '/images/keyboard.jpg',
                              4: '/images/monitor.jpg',
                              5: '/images/headphones.jpg',
                              6: '/images/webcam.jpg',
                              7: '/images/harddrive.jpg',
                              8: '/images/charger.jpg',
                              9: '/images/camera.jpg'
                            };
                            e.target.src = fallbackMap[p.id] || '/images/backpack.jpg';
                          } else {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Categoría y Rating */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      ★ <span className="text-slate-700">4.9</span>
                    </div>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="font-heading font-black text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {p.nombre || p.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2 leading-relaxed">
                    {p.descripcion || p.description || 'Producto tecnológico garantizado de alta durabilidad.'}
                  </p>
                </div>

                {/* Precio y Botón de Acción */}
                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Precio Oferta</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-xl text-slate-900 font-mono">
                          S/ {price.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-350 line-through font-mono">
                          S/ {originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                      inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {inStock ? 'En Stock' : 'Agotado'}
                    </span>
                  </div>

                  {/* Botón Agregar al Carrito */}
                  <button 
                    onClick={(e) => agregarAlCarrito(p, e)} 
                    disabled={!inStock}
                    className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 btn-tactile ${
                      inStock
                        ? addingId === p.id
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-[0.98]'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-blue-600/35'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                    }`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{addingId === p.id ? '¡Agregado!' : 'Agregar al Carrito'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE VISTA RÁPIDA DE PRODUCTO */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black text-sm transition-colors">
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Imagen Grande */}
              <div className="h-64 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center">
                <img 
                  src={quickViewProduct.imagen || quickViewProduct.image || '/images/backpack.jpg'} 
                  alt={quickViewProduct.nombre} 
                  className="max-h-full max-w-full object-contain rounded-lg"
                  onError={(e) => { e.target.src = '/images/backpack.jpg'; }}
                />
              </div>

              {/* Detalles */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {quickViewProduct.categoria || quickViewProduct.category || 'Producto Destacado'}
                </span>

                <h2 className="font-heading font-black text-2xl text-slate-900 leading-tight">
                  {quickViewProduct.nombre || quickViewProduct.title}
                </h2>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {quickViewProduct.descripcion || quickViewProduct.description || 'Producto premium importado con certificación oficial de calidad.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Precio Final</span>
                    <span className="font-heading font-black text-3xl text-slate-900 font-mono">
                      S/ {(quickViewProduct.precio || quickViewProduct.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Stock Disponible
                  </span>
                </div>

                <button 
                  onClick={(e) => {
                    agregarAlCarrito(quickViewProduct, e);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 transition-all btn-tactile">
                  Agregar al Carrito Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
