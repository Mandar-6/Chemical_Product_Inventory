const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Database connection
// Handle password with special characters - decode URL encoding if present
let dbPassword = process.env.DB_PASSWORD || '';
// Decode URL-encoded characters (e.g., %23 becomes #)
if (dbPassword.includes('%')) {
  dbPassword = decodeURIComponent(dbPassword);
}
// Remove quotes if present (dotenv might include them)
dbPassword = dbPassword.replace(/^["']|["']$/g, '');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: dbPassword,
  database: process.env.DB_NAME || 'chemflo_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper function to extract route parameters
function getRouteParams(pathname, pattern) {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  const params = {};
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].substring(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  
  return params;
}

// Route handler
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // ==================== PRODUCT ROUTES ====================
    
    // GET /api/products - Get all products
    if (method === 'GET' && pathname === '/api/products') {
      const [rows] = await pool.execute(
        'SELECT * FROM products ORDER BY product_name ASC'
      );
      sendJSON(res, 200, rows);
      return;
    }

    // GET /api/products/:id - Get single product by ID
    const productByIdMatch = getRouteParams(pathname, '/api/products/:id');
    if (method === 'GET' && productByIdMatch) {
      const [rows] = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [productByIdMatch.id]
      );
      if (rows.length === 0) {
        sendJSON(res, 404, { error: 'Product not found' });
        return;
      }
      sendJSON(res, 200, rows[0]);
      return;
    }

    // POST /api/products - Create new product
    if (method === 'POST' && pathname === '/api/products') {
      const body = await parseBody(req);
      const { product_name, cas_number, unit_of_measurement } = body;

      // Validation
      if (!product_name || !cas_number || !unit_of_measurement) {
        sendJSON(res, 400, { error: 'All fields are required' });
        return;
      }

      // Check if CAS number already exists
      const [existing] = await pool.execute(
        'SELECT id FROM products WHERE cas_number = ?',
        [cas_number]
      );
      if (existing.length > 0) {
        sendJSON(res, 400, { error: 'CAS number must be unique' });
        return;
      }

      // Insert product
      const [result] = await pool.execute(
        'INSERT INTO products (product_name, cas_number, unit_of_measurement) VALUES (?, ?, ?)',
        [product_name, cas_number, unit_of_measurement]
      );

      // Create initial inventory entry with 0 stock
      await pool.execute(
        'INSERT INTO inventory (product_id, current_stock) VALUES (?, ?)',
        [result.insertId, 0]
      );

      sendJSON(res, 201, {
        id: result.insertId,
        product_name,
        cas_number,
        unit_of_measurement
      });
      return;
    }

    // PUT /api/products/:id - Update product
    if (method === 'PUT' && productByIdMatch) {
      const body = await parseBody(req);
      const { product_name, cas_number, unit_of_measurement } = body;
      const productId = productByIdMatch.id;

      // Validation
      if (!product_name || !cas_number || !unit_of_measurement) {
        sendJSON(res, 400, { error: 'All fields are required' });
        return;
      }

      // Check if product exists
      const [existing] = await pool.execute(
        'SELECT id FROM products WHERE id = ?',
        [productId]
      );
      if (existing.length === 0) {
        sendJSON(res, 404, { error: 'Product not found' });
        return;
      }

      // Check if CAS number is used by another product
      const [casCheck] = await pool.execute(
        'SELECT id FROM products WHERE cas_number = ? AND id != ?',
        [cas_number, productId]
      );
      if (casCheck.length > 0) {
        sendJSON(res, 400, { error: 'CAS number must be unique' });
        return;
      }

      // Update product
      await pool.execute(
        'UPDATE products SET product_name = ?, cas_number = ?, unit_of_measurement = ? WHERE id = ?',
        [product_name, cas_number, unit_of_measurement, productId]
      );

      sendJSON(res, 200, { id: productId, product_name, cas_number, unit_of_measurement });
      return;
    }

    // DELETE /api/products/:id - Delete product
    if (method === 'DELETE' && productByIdMatch) {
      const productId = productByIdMatch.id;

      // Check if product exists
      const [existing] = await pool.execute(
        'SELECT id FROM products WHERE id = ?',
        [productId]
      );
      if (existing.length === 0) {
        sendJSON(res, 404, { error: 'Product not found' });
        return;
      }

      // Delete inventory first (foreign key constraint)
      await pool.execute('DELETE FROM inventory WHERE product_id = ?', [productId]);
      
      // Delete product
      await pool.execute('DELETE FROM products WHERE id = ?', [productId]);

      sendJSON(res, 200, { message: 'Product deleted successfully' });
      return;
    }

    // ==================== INVENTORY ROUTES ====================

    // GET /api/inventory - Get all inventory with product details
    if (method === 'GET' && pathname === '/api/inventory') {
      const [rows] = await pool.execute(
        `SELECT 
          i.id,
          i.product_id,
          i.current_stock,
          p.product_name,
          p.cas_number,
          p.unit_of_measurement
        FROM inventory i
        INNER JOIN products p ON i.product_id = p.id
        ORDER BY p.product_name ASC`
      );
      sendJSON(res, 200, rows);
      return;
    }

    // GET /api/inventory/:id - Get single inventory item
    const inventoryByIdMatch = getRouteParams(pathname, '/api/inventory/:id');
    if (method === 'GET' && inventoryByIdMatch) {
      const [rows] = await pool.execute(
        `SELECT 
          i.id,
          i.product_id,
          i.current_stock,
          p.product_name,
          p.cas_number,
          p.unit_of_measurement
        FROM inventory i
        INNER JOIN products p ON i.product_id = p.id
        WHERE i.id = ?`,
        [inventoryByIdMatch.id]
      );
      if (rows.length === 0) {
        sendJSON(res, 404, { error: 'Inventory item not found' });
        return;
      }
      sendJSON(res, 200, rows[0]);
      return;
    }

    // POST /api/inventory/:id/stock - Update stock (IN or OUT)
    const stockUpdateMatch = getRouteParams(pathname, '/api/inventory/:id/stock');
    if (method === 'POST' && stockUpdateMatch) {
      const body = await parseBody(req);
      const inventoryId = stockUpdateMatch.id;
      const { type, quantity } = body;

      // Validation
      if (!type || (type !== 'IN' && type !== 'OUT')) {
        sendJSON(res, 400, { error: 'Type must be IN or OUT' });
        return;
      }

      // Convert quantity to number and validate
      const quantityNum = parseFloat(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        sendJSON(res, 400, { error: 'Quantity must be a positive number' });
        return;
      }

      // Get current stock
      const [inventory] = await pool.execute(
        'SELECT current_stock FROM inventory WHERE id = ?',
        [inventoryId]
      );

      if (inventory.length === 0) {
        sendJSON(res, 404, { error: 'Inventory item not found' });
        return;
      }

      // Ensure both values are numbers for proper arithmetic
      const currentStock = parseFloat(inventory[0].current_stock);
      let newStock;

      if (type === 'IN') {
        newStock = currentStock + quantityNum;
      } else {
        // OUT - check if stock would go below zero
        newStock = currentStock - quantityNum;
        if (newStock < 0) {
          sendJSON(res, 400, {
            error: 'Insufficient stock. Stock cannot go below zero.'
          });
          return;
        }
      }

      // Update stock
      await pool.execute(
        'UPDATE inventory SET current_stock = ? WHERE id = ?',
        [newStock, inventoryId]
      );

      // Get updated inventory with product details
      const [updated] = await pool.execute(
        `SELECT 
          i.id,
          i.product_id,
          i.current_stock,
          p.product_name,
          p.cas_number,
          p.unit_of_measurement
        FROM inventory i
        INNER JOIN products p ON i.product_id = p.id
        WHERE i.id = ?`,
        [inventoryId]
      );

      sendJSON(res, 200, updated[0]);
      return;
    }

    // 404 - Route not found
    sendJSON(res, 404, { error: 'Route not found' });

  } catch (error) {
    console.error('Error handling request:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
}

// Create HTTP server
const server = http.createServer(handleRequest);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
