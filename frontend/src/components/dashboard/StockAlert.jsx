import React from 'react';
import { AlertTriangle, Package, CheckCircle } from 'lucide-react';

function StockAlert({ products = [] }) {
  const getAlertLabel = (product) => {
    if (product.outOfStockQuantity > 0 || product.stockQuantity === 0) {
      return 'Out of Stock';
    }
    if (product.expiredQuantity > 0) {
      return 'Expired';
    }
    if (product.lowStockQuantity > 0 || (product.stockQuantity > 0 && product.stockQuantity <= (product.reorderLevel ?? 10))) {
      return 'Low Stock';
    }
    return 'Normal';
  };

  return (
    <div className="stock-alert">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle color="#e11d48" size={24} />
        Low Stock / Out-of-Stock Products
      </h2>

      {products.length === 0 ? (
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
          <CheckCircle size={18} />
          No low stock products
        </p>
      ) : (
        products.map((product, idx) => {
          const alertLabel = getAlertLabel(product);
          return (
            <div key={product._id || product.sku || product.name || idx} className="stock-alert-item">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} />
                {product.name}
              </h3>

              <p>
                Current Stock: <strong>{product.stockQuantity}</strong>{' '}
                <span style={{ color: alertLabel === 'Out of Stock' ? '#dc2626' : alertLabel === 'Expired' ? '#b91c1c' : '#f59e0b' }}>
                  ({alertLabel})
                </span>
              </p>

              <p>
                Reorder Level: <strong>{product.reorderLevel ?? 10}</strong>
              </p>

              {product.expiredQuantity ? (
                <p style={{ color: '#b91c1c' }}>
                  Expired Quantity: <strong>{product.expiredQuantity}</strong> <span style={{ marginLeft: 8 }}>(Expired)</span>
                </p>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}

export default StockAlert;