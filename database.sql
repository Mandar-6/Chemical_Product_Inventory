-- Create database
CREATE DATABASE IF NOT EXISTS chemflo_inventory;
USE chemflo_inventory;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  cas_number VARCHAR(50) NOT NULL UNIQUE,
  unit_of_measurement VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product (product_id)
);

-- Insert sample data (optional)
INSERT INTO products (product_name, cas_number, unit_of_measurement) VALUES
('Sodium Chloride', '7647-14-5', 'kg'),
('Hydrochloric Acid', '7647-01-0', 'L'),
('Sodium Hydroxide', '1310-73-2', 'kg')
ON DUPLICATE KEY UPDATE product_name=product_name;

-- Create initial inventory entries for sample products
INSERT INTO inventory (product_id, current_stock) 
SELECT id, 100 FROM products WHERE cas_number = '7647-14-5'
ON DUPLICATE KEY UPDATE current_stock=current_stock;

INSERT INTO inventory (product_id, current_stock) 
SELECT id, 50 FROM products WHERE cas_number = '7647-01-0'
ON DUPLICATE KEY UPDATE current_stock=current_stock;

INSERT INTO inventory (product_id, current_stock) 
SELECT id, 75 FROM products WHERE cas_number = '1310-73-2'
ON DUPLICATE KEY UPDATE current_stock=current_stock;


