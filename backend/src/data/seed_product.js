const { initDatabase } = require('../config/database');
const { initDatabase: initTables } = require('../models/init');
const ProductoService = require('../services/ProductoService');
const ProductoRepository = require('../repositories/ProductoRepository');

const inputData = [
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack",
    "price": 109.95,
    "description": "Your perfect pack for everyday use...",
    "category": "men's clothing",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    "rating": { "rate": 3.9, "count": 120 }
  }
];

async function seed() {
  try {
    await initDatabase();
    await initTables();

    for (const item of inputData) {
      const normalized = ProductoService.normalizeData(item);
      const existing = await ProductoRepository.findById(item.id);

      if (existing) {
        console.log(`Actualizando producto con ID ${item.id}...`);
        await ProductoRepository.update(item.id, normalized);
      } else {
        console.log(`Insertando nuevo producto con ID ${item.id}...`);
        await ProductoRepository.create(normalized);
      }
    }

    console.log('¡Producto(s) integrado(s) con éxito en la base de datos!');
  } catch (err) {
    console.error('Error al realizar el seeding:', err);
    process.exit(1);
  }
}

seed();
