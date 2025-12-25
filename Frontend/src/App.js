import React, { useState } from 'react';
import ProductManagement from './components/ProductManagement';
import InventoryList from './components/InventoryList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>ChemFlo - Chemical Inventory Management</h1>
        </div>
      </header>
      
      <div className="container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
          <button
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory List
          </button>
        </div>

        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'inventory' && <InventoryList />}
      </div>
    </div>
  );
}

export default App;


