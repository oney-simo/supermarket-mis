import React from 'react';
import { AlertTriangle, Package, CheckCircle } from 'lucide-react';
import { getInventoryStockStatus } from '../../utils/stockStatus';

function StockAlert({ products = [], lowStockThreshold = 5 }) {
  const getAlertLabel = (product) => {
    if (product?.status && ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'].includes(product.status)) {
      return product.status;
    }

    if (product.outOfStockQuantity > 0 || product.stockQuantity === 0) {
      return 'Out of Stock';
    }
    if (product.expiredQuantity > 0) {
      return 'Expired';
    }
    if (product.lowStockQuantity > 0 || (product.stockQuantity > 0 && product.stockQuantity <= (product.lowStockThreshold ?? lowStockThreshold))) {
      return 'Low Stock';
    }

    return getInventoryStockStatus(product, new Date(), lowStockThreshold);
  };

  return (
    <div className="stock-alert">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle color="#e11d48" size={24} />
        Stock Alerts
      </h2>

      {products.length === 0 ? (
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
          <CheckCircle size={18} />
          No stock alerts
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
                <span style={{ color: alertLabel === 'Out of Stock' ? '#dc2626' : alertLabel === 'Expired' ? '#b91c1c' : alertLabel === 'Low Stock' ? '#f59e0b' : '#16a34a' }}>
                  ({alertLabel})
                </span>
              </p>

              <p>
                Threshold: <strong>{product.lowStockThreshold ?? lowStockThreshold}</strong>
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