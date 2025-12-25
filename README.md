# Chemical Inventory Management System

A full-stack inventory management system for tracking chemical products with stock management capabilities.

## Features

- **Product Management**: CRUD operations for chemical products
  - Product name
  - CAS number (unique)
  - Unit of measurement
- **Inventory Tracking**: Real-time stock monitoring
- **Stock Updates**: Increase (IN) or decrease (OUT) stock levels
- **Validation**: Prevents negative stock and ensures unique CAS numbers

## Tech Stack

- **Backend**: Node.js
- **Database**: MySQL
- **Frontend**: React.js, HTML, CSS

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm 

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get all inventory items with product details
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory/:id/stock` - Update stock (body: `{ type: 'IN'|'OUT', quantity: number }`)

## Usage

1. **Add Products**: Use the "Product Management" tab to add chemical products with their CAS numbers and units.

2. **View Inventory**: Switch to the "Inventory List" tab to see all products with their current stock levels.

3. **Update Stock**: Click "Update Stock" on any inventory item to increase (IN) or decrease (OUT) the stock quantity.

## Validation Rules

- CAS numbers must be unique
- Stock quantities cannot be negative
- All product fields are required
- Stock cannot go below zero when decreasing

## Project Structure

```
chemflo/
├── server.js              # Node backend server
├── database.sql           # Database schema and sample data
├── package.json           # Backend dependencies
├── .env                   # Environment variables (create this)
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── services/
    │   │   └── api.js     # API service layer
    │   └── components/
    │       ├── ProductManagement.js
    │       └── InventoryList.js
    └── package.json       # Frontend dependencies
```

## Notes

- The application focuses on core inventory management features only
- No authentication or user management is included
- Sample data is included in `database.sql` for testing


