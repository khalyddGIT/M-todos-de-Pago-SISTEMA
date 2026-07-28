const { db } = require('../config/database');

async function initDatabase() {
  await db.exec(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='productos' AND xtype='U')
    CREATE TABLE productos (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre NVARCHAR(255) NOT NULL,
      descripcion NVARCHAR(MAX),
      precio DECIMAL(18,2) NOT NULL CHECK(precio > 0),
      stock INT NOT NULL DEFAULT 0 CHECK(stock >= 0),
      categoria NVARCHAR(100),
      imagen NVARCHAR(MAX),
      rating_rate DECIMAL(5,2) DEFAULT 0,
      rating_count INT DEFAULT 0,
      createdAt DATETIME DEFAULT GETDATE(),
      updatedAt DATETIME DEFAULT GETDATE()
    );

    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='carrito' AND xtype='U')
    CREATE TABLE carrito (
      id INT IDENTITY(1,1) PRIMARY KEY,
      producto_id INT NOT NULL,
      cantidad INT NOT NULL DEFAULT 1 CHECK(cantidad > 0),
      session_id NVARCHAR(255) NOT NULL,
      FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
    );

    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pedidos' AND xtype='U')
    CREATE TABLE pedidos (
      id INT IDENTITY(1,1) PRIMARY KEY,
      session_id NVARCHAR(255) NOT NULL,
      total DECIMAL(18,2) NOT NULL CHECK(total >= 0),
      estado NVARCHAR(50) NOT NULL DEFAULT 'PENDIENTE' CHECK(estado IN ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'CANCELADO')),
      metodo_pago NVARCHAR(100),
      transaction_id NVARCHAR(255),
      createdAt DATETIME DEFAULT GETDATE(),
      updatedAt DATETIME DEFAULT GETDATE()
    );

    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pedido_items' AND xtype='U')
    CREATE TABLE pedido_items (
      id INT IDENTITY(1,1) PRIMARY KEY,
      pedido_id INT NOT NULL,
      producto_id INT NOT NULL,
      cantidad INT NOT NULL CHECK(cantidad > 0),
      precio_unitario DECIMAL(18,2) NOT NULL CHECK(precio_unitario >= 0),
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );

    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transacciones' AND xtype='U')
    CREATE TABLE transacciones (
      id INT IDENTITY(1,1) PRIMARY KEY,
      pedido_id INT NOT NULL,
      metodo_pago NVARCHAR(100) NOT NULL,
      monto DECIMAL(18,2) NOT NULL CHECK(monto >= 0),
      transaction_id NVARCHAR(255),
      estado NVARCHAR(50) NOT NULL DEFAULT 'PENDIENTE' CHECK(estado IN ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'CANCELADO')),
      respuesta_api NVARCHAR(MAX),
      createdAt DATETIME DEFAULT GETDATE(),
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    );
  `);

  try {
    const countRow = await db.get("SELECT COUNT(*) as count FROM productos");
    const productCount = countRow ? countRow.count : 0;

    const defaultProducts = [
      { id: 1, nombre: "Fjallraven - Foldsack No. 1 Backpack", descripcion: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.", precio: 109.95, stock: 25, categoria: "men's clothing", imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80", rating_rate: 3.9, rating_count: 120 },
      { id: 2, nombre: "Mouse Ergonómico Inalámbrico 2.4GHz", descripcion: "Diseño ergonómico con sensor óptico de alta precisión 1600 DPI", precio: 45.90, stock: 40, categoria: "tecnologia", imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80", rating_rate: 4.8, rating_count: 85 },
      { id: 3, nombre: "Teclado Mecánico RGB Switch Blue", descripcion: "Teclado gamer compacto con iluminación RGB personalizable", precio: 129.00, stock: 15, categoria: "tecnologia", imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80", rating_rate: 4.5, rating_count: 60 },
      { id: 4, nombre: "Monitor 24 IPS Full HD 75Hz", descripcion: "Pantalla ultra delgada con filtro de luz azul", precio: 499.00, stock: 8, categoria: "tecnologia", imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80", rating_rate: 4.7, rating_count: 42 },
      { id: 5, nombre: "Audífonos Inalámbricos Bluetooth 5.0", descripcion: "Cancelación de ruido activa y batería de 30 horas", precio: 89.90, stock: 30, categoria: "audio", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", rating_rate: 4.9, rating_count: 110 },
      { id: 6, nombre: "Webcam Full HD 1080p con Micrófono", descripcion: "Ideal para videoconferencias y streaming", precio: 75.00, stock: 20, categoria: "tecnologia", imagen: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80", rating_rate: 4.4, rating_count: 53 },
      { id: 7, nombre: "Disco Duro Externo 1TB USB 3.0", descripcion: "Almacenamiento portátil resistente a golpes", precio: 180.00, stock: 12, categoria: "almacenamiento", imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80", rating_rate: 4.3, rating_count: 39 },
      { id: 8, nombre: "Cargador USB-C 65W GaN", descripcion: "Carga rápida para laptops y smartphones", precio: 89.90, stock: 25, categoria: "accesorios", imagen: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80", rating_rate: 4.6, rating_count: 74 },
      { id: 9, nombre: "Cámara Web 4K Ultra HD", descripcion: "Sensor Sony 4K con enfoque automático", precio: 299.00, stock: 5, categoria: "fotografia", imagen: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80", rating_rate: 5.0, rating_count: 10 }
    ];

    if (productCount === 0) {
      console.log('Poblando catálogo por defecto de productos en SQL Server...');
      let sqlBatch = 'SET IDENTITY_INSERT productos ON;\n';
      for (const p of defaultProducts) {
        const desc = p.descripcion.replace(/'/g, "''");
        const name = p.nombre.replace(/'/g, "''");
        const cat = p.categoria.replace(/'/g, "''");
        const img = p.imagen.replace(/'/g, "''");
        sqlBatch += `INSERT INTO productos (id, nombre, descripcion, precio, stock, categoria, imagen, rating_rate, rating_count) VALUES (${p.id}, '${name}', '${desc}', ${p.precio}, ${p.stock}, '${cat}', '${img}', ${p.rating_rate}, ${p.rating_count});\n`;
      }
      sqlBatch += 'SET IDENTITY_INSERT productos OFF;';
      await db.exec(sqlBatch);
    } else {
      for (const p of defaultProducts) {
        await db.run(
          `UPDATE productos SET 
            imagen = CASE WHEN imagen IS NULL OR imagen = '' THEN ? ELSE imagen END,
            categoria = CASE WHEN categoria IS NULL OR categoria = '' THEN ? ELSE categoria END,
            rating_rate = CASE WHEN rating_rate IS NULL OR rating_rate = 0 THEN ? ELSE rating_rate END,
            rating_count = CASE WHEN rating_count IS NULL OR rating_count = 0 THEN ? ELSE rating_count END
           WHERE id = ?`,
          [p.imagen, p.categoria, p.rating_rate, p.rating_count, p.id]
        );
      }
    }
  } catch (err) {
    console.error('Error al inicializar productos en SQL Server:', err);
  }
}

module.exports = { initDatabase };
