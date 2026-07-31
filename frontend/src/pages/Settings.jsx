import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/settingsApi';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const applyTheme = (themeValue) => {
    const resolvedTheme = themeValue === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : (themeValue || 'light');

    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
    window.localStorage.setItem('app-theme', resolvedTheme);
  };

  // Form State corresponding to Mongoose Settings Schema
  const [formData, setFormData] = useState({
    // 1. Business Info
    businessName: '',
    logo: '',
    phone: '',
    email: '',
    address: '',

    // 2. Receipt Settings
    receiptHeader: '',
    receiptFooter: '',

    // 3. Tax & Currency
    currencySymbol: 'TZS',
    taxRate: 0,

    // 4. Inventory Settings
    lowStockThreshold: 5,
    allowNegativeStock: false,

    // 5. Sales Settings
    enableDiscount: true,
    maxDiscountPercent: 100,

    // 6. User & Security
    sessionTimeoutMinutes: 60,
    requireAdminForVoid: true,

    // 7. Backup & Restore
    autoBackupFrequency: 'disabled',

    // 8. Notifications
    enableEmailAlerts: false,
    notificationEmail: '',

    // 9. Activity Log Settings
    logRetentionDays: 30,

    // 10. Appearance
    theme: 'light'
  });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('app-theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }

    fetchSettings();
  }, []);

  useEffect(() => {
    if (formData.theme) {
      applyTheme(formData.theme);
    }
  }, [formData.theme]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      if (data) {
        setFormData((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load system settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      const res = await updateSettings(formData);
      setMessage({ type: 'success', text: res.message || 'Settings updated successfully!' });
      if (res.settings) {
        const nextTheme = res.settings.theme || formData.theme;
        setFormData((prev) => ({ ...prev, ...res.settings, theme: nextTheme }));
        applyTheme(nextTheme);
        window.dispatchEvent(new Event('settings:updated'));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading system settings...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '20px' }}>System Settings</h2>

      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #dee2e6', marginBottom: '20px' }}>
        {[
          { id: 'business', label: 'Business Profile' },
          { id: 'receipt', label: 'Receipt & Tax' },
          { id: 'sales_inventory', label: 'Sales & Inventory' },
          { id: 'security_system', label: 'System & Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              color: activeTab === tab.id ? '#007bff' : '#495057',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          
          {/* TAB 1: Business Profile */}
          {activeTab === 'business' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Business Details</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Logo URL</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Receipt & Tax */}
          {activeTab === 'receipt' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Receipt & Tax Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Currency Symbol</label>
                  <input
                    type="text"
                    name="currencySymbol"
                    value={formData.currencySymbol}
                    onChange={handleChange}
                    placeholder="e.g. $, TSh, €"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Receipt Header Text</label>
                <input
                  type="text"
                  name="receiptHeader"
                  value={formData.receiptHeader}
                  onChange={handleChange}
                  placeholder="Welcome to Supermarket"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Receipt Footer Text</label>
                <input
                  type="text"
                  name="receiptFooter"
                  value={formData.receiptFooter}
                  onChange={handleChange}
                  placeholder="Thank you for shopping with us!"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Sales & Inventory */}
          {activeTab === 'sales_inventory' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Inventory & Sales Rules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Max Discount Allowed (%)</label>
                  <input
                    type="number"
                    name="maxDiscountPercent"
                    value={formData.maxDiscountPercent}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    name="allowNegativeStock"
                    checked={formData.allowNegativeStock}
                    onChange={handleChange}
                  />
                  Allow Negative Stock (Sell items when stock reaches zero)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    name="enableDiscount"
                    checked={formData.enableDiscount}
                    onChange={handleChange}
                  />
                  Enable Item & Sale Discounts
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: System & Security */}
          {activeTab === 'security_system' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>System, Security & Maintenance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    name="sessionTimeoutMinutes"
                    value={formData.sessionTimeoutMinutes}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Log Retention (Days)</label>
                  <input
                    type="number"
                    name="logRetentionDays"
                    value={formData.logRetentionDays}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Auto Backup Frequency</label>
                  <select
                    name="autoBackupFrequency"
                    value={formData.autoBackupFrequency}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  >
                    <option value="disabled">Disabled</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Theme Appearance</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '12px' }}>
                  <input
                    type="checkbox"
                    name="requireAdminForVoid"
                    checked={formData.requireAdminForVoid}
                    onChange={handleChange}
                  />
                  Require Admin Verification for Voids / Cancellations
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    name="enableEmailAlerts"
                    checked={formData.enableEmailAlerts}
                    onChange={handleChange}
                  />
                  Enable System Email Notifications
                </label>
              </div>

              {formData.enableEmailAlerts && (
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Notification Email Target</label>
                  <input
                    type="email"
                    name="notificationEmail"
                    value={formData.notificationEmail}
                    onChange={handleChange}
                    placeholder="admin@supermarket.com"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Controls */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 24px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving Settings...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}