import React from 'react';

export default function CartItemRow({ item, index, products, onChange, onRemove, canRemove }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
      <select
        required
        value={item.product}
        onChange={(e) => onChange(index, 'product', e.target.value)}
        style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">-- Choose Product --</option>
        {products.map((prod) => (
          <option key={prod._id} value={prod._id}>
            {prod.name} (${prod.sellingPrice || prod.price || 0})
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        required
        placeholder="Qty"
        value={item.quantity}
        onChange={(e) => onChange(index, 'quantity', e.target.value)}
        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <input
        type="number"
        step="0.01"
        required
        placeholder="Unit Price"
        value={item.unitPrice}
        onChange={(e) => onChange(index, 'unitPrice', e.target.value)}
        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {canRemove ? (
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{ padding: '8px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          X
        </button>
      ) : (
        <div style={{ width: '31px' }} />
      )}
    </div>
  );
}