import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { getSales } from '../api/salesApi';
import { getCustomers } from '../api/customerApi'; // 1. Added import
import SalesTable from '../components/sales/SalesTable';
import POSModal from '../components/sales/POSModal';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]); // 2. Added state for customers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // 3. Added getCustomers() to Promise.all
      const [salesData, productsRes, customersData] = await Promise.all([
        getSales(),
        api.get('/products'),
        getCustomers()
      ]);
      setSales(Array.isArray(salesData) ? salesData : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setError(null);
    } catch (err) {
      setError('Failed to load sales data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Sales Transactions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + New POS Checkout
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <SalesTable sales={sales} loading={loading} />

      <POSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        customers={customers} // 4. Passed customers list to POSModal
        onSuccess={fetchInitialData}
      />
    </div>
  );
}