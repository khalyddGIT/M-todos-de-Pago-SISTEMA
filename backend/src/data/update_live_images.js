const items = [
  { id: 1, title: 'Fjallraven - Foldsack No. 1 Backpack', price: 109.95, description: 'Your perfect pack for everyday use...', category: 'men\'s clothing', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', rating: { rate: 3.9, count: 120 }, stock: 20 },
  { id: 2, nombre: 'Mouse Logitech MX Master 3S', categoria: 'tecnologia', imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80', rating_rate: 4.8, rating_count: 85 },
  { id: 3, nombre: 'Teclado Mecanico Redragon', categoria: 'tecnologia', imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80', rating_rate: 4.5, rating_count: 60 },
  { id: 4, nombre: 'Monitor Samsung 27 FHD', categoria: 'tecnologia', imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', rating_rate: 4.7, rating_count: 42 },
  { id: 5, nombre: 'Audifonos Sony XM5', categoria: 'audio', imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', rating_rate: 4.9, rating_count: 110 },
  { id: 6, nombre: 'Webcam Logitech C920', categoria: 'tecnologia', imagen: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80', rating_rate: 4.4, rating_count: 53 },
  { id: 7, nombre: 'Disco Duro Externo 1TB', categoria: 'almacenamiento', imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80', rating_rate: 4.3, rating_count: 39 },
  { id: 8, nombre: 'Cargador USB-C 65W GaN', categoria: 'accesorios', imagen: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', rating_rate: 4.6, rating_count: 74 },
  { id: 9, nombre: 'Camara Retro Vintage', categoria: 'fotografia', imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80', rating_rate: 5.0, rating_count: 10 }
];

async function updateLive() {
  for (const item of items) {
    try {
      const res = await fetch('http://localhost:3000/api/productos/' + item.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      console.log('Updated Live ID', item.id, data.nombre || data.title, '->', data.imagen);
    } catch (e) {
      console.error('Error updating ID', item.id, e.message);
    }
  }
}

updateLive();
