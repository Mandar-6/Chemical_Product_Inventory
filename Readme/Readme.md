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

## Usage

1. **Add Products**: Use the "Product Management" tab to add chemical products with their CAS numbers and units.

2. **View Inventory**: Switch to the "Inventory List" tab to see all products with their current stock levels.

3. **Update Stock**: Click "Update Stock" on any inventory item to increase (IN) or decrease (OUT) the stock quantity.

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


