const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'root',
  server: 'localhost',
  port: 1433,
  database: 'master', // Start with master to connect initially
  options: {
    encrypt: false,
    trustServerCertificate: true // Crucial for local dev environments
  }
};

let pool = null;

function translateSql(query, translateParams = true) {
  let translated = query;
  // Convert sqlite datetime('now') to SQL Server GETDATE()
  translated = translated.replace(/datetime\('now'\)/gi, 'GETDATE()');
  // Convert sqlite LIMIT 1 to SQL Server TOP 1
  if (translated.toUpperCase().includes('LIMIT 1')) {
    translated = translated.replace(/SELECT\s+/gi, 'SELECT TOP 1 ').replace(/LIMIT\s+1/gi, '');
  }
  
  if (!translateParams) return translated;
  
  // Convert sqlite ? parameters to SQL Server @p0, @p1 parameters, skipping single-quoted strings
  let paramIndex = 0;
  let inString = false;
  let result = '';
  for (let i = 0; i < translated.length; i++) {
    const char = translated[i];
    if (char === "'") {
      inString = !inString;
      result += char;
    } else if (char === '?' && !inString) {
      result += `@p${paramIndex++}`;
    } else {
      result += char;
    }
  }
  return result;
}

const adapter = {
  async exec(sqlStr) {
    if (!pool) throw new Error('Database not initialized');
    // Disable parameter translation for raw exec schema scripts
    const translated = translateSql(sqlStr, false);
    const req = pool.request();
    await req.query(translated);
  },

  async run(sqlStr, params = []) {
    if (!pool) throw new Error('Database not initialized');
    
    let isInsert = sqlStr.trim().toUpperCase().startsWith('INSERT');
    let finalSql = sqlStr;
    
    if (isInsert) {
      finalSql = `${sqlStr}; SELECT SCOPE_IDENTITY() as lastInsertRowid;`;
    }
    
    const translated = translateSql(finalSql, true);
    const req = pool.request();
    for (let i = 0; i < params.length; i++) {
      req.input(`p${i}`, params[i]);
    }
    
    const result = await req.query(translated);
    let id = null;
    if (isInsert && result.recordset && result.recordset[0]) {
      id = result.recordset[0].lastInsertRowid;
    }
    return { lastInsertRowid: id };
  },

  async all(sqlStr, params = []) {
    if (!pool) throw new Error('Database not initialized');
    
    const translated = translateSql(sqlStr, true);
    const req = pool.request();
    for (let i = 0; i < params.length; i++) {
      req.input(`p${i}`, params[i]);
    }
    
    const result = await req.query(translated);
    return result.recordset || [];
  },

  async get(sqlStr, params = []) {
    if (!pool) throw new Error('Database not initialized');
    
    const translated = translateSql(sqlStr, true);
    const req = pool.request();
    for (let i = 0; i < params.length; i++) {
      req.input(`p${i}`, params[i]);
    }
    
    const result = await req.query(translated);
    return (result.recordset && result.recordset[0]) || null;
  }
};

async function initDatabase() {
  console.log("Iniciando conexión a Microsoft SQL Server...");
  
  // 1. Connect to master to check/create the database
  let tempPool = await sql.connect(config);
  try {
    const checkDbResult = await tempPool.request().query("SELECT database_id FROM sys.databases WHERE name = 'carrito_pagos'");
    if (checkDbResult.recordset.length === 0) {
      console.log("Creando base de datos 'carrito_pagos' en SQL Server...");
      await tempPool.request().query("CREATE DATABASE carrito_pagos");
    }
  } finally {
    await tempPool.close();
  }

  // 2. Connect to the application database
  const appConfig = { ...config, database: 'carrito_pagos' };
  pool = await sql.connect(appConfig);
  console.log("Conectado exitosamente a SQL Server ('carrito_pagos')");
  
  return adapter;
}

module.exports = { db: adapter, initDatabase };
