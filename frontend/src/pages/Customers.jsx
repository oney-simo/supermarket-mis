import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../api/customerApi';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerModal from '../components/customers/CustomerModal';
import CustomerPurchasesModal from '../components/customers/CustomerPurchasesModal';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load customers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenHistory = (customer) => {
    setSelectedCustomer(customer);
    setIsHistoryOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        loadCustomers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customer Management</h2>
        <button
          onClick={handleOpenCreate}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Customer
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onViewHistory={handleOpenHistory}
      />

      <CustomerModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customerToEdit={selectedCustomer}
        onSuccess={loadCustomers}
      />

      <CustomerPurchasesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}