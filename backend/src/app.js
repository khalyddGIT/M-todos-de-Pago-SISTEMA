const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');
const { initDatabase: initTables } = require('./models/init');
const errorHandler = require('./middlewares/errorHandler');

const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const pedidosRoutes = require('./routes/pedidos');
const pagosRoutes = require('./routes/pagos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve product images
app.use('/images', express.static(path.join(__dirname, '..', '..', 'frontend', 'public', 'images')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pagos', pagosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.url}` });
});

app.use(errorHandler);

async function start() {
  try {
    await initDatabase();
    await initTables();
    console.log('Base de datos inicializada correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Endpoints:`);
      console.log(`  GET  /api/health`);
      console.log(`  CRUD /api/productos`);
      console.log(`  Cart /api/carrito`);
      console.log(`  Ord. /api/pedidos`);
      console.log(`  Pay. /api/pagos`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

start();
