import React from 'react';
import { AlertTriangle, Package, CheckCircle } from 'lucide-react';

function StockAlert({ products }) {
  return (
    <div className="stock-alert">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle color="#e11d48" size={24} />
        Low Stock Products
      </h2>

      {products.length === 0 ? (
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
          <CheckCircle size={18} />
          No low stock products
        </p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="stock-alert-item">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} />
              {product.name}
            </h3>

            <p>
              Current Stock: <strong>{product.stockQuantity}</strong>
            </p>

            <p>
              Reorder Level: <strong>{product.reorderLevel}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default StockAlert;