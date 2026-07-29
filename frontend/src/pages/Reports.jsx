import React, { useState, useEffect } from 'react';
import {
  getSalesSummary,
  getTopSellingProducts,
  getInventoryValuation,
  getDailySalesChart
} from '../api/reportApi';
import SummaryCards from '../components/reports/SummaryCards';
import DailySalesChart from '../components/reports/DailySalesChart';
import TopProductsChart from '../components/reports/TopProductsChart';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [dailyChart, setDailyChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  // Date Range Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadAllReportData();
  }, []);

  const loadAllReportData = async () => {
    try {
      setLoading(true);
      const [summaryRes, topProdRes, valRes, chartRes] = await Promise.all([
        getSalesSummary(startDate, endDate),
        getTopSellingProducts(),
        getInventoryValuation(),
        getDailySalesChart()
      ]);

      setSummary(summaryRes);
      setTopProducts(Array.isArray(topProdRes) ? topProdRes : []);
      setValuation(valRes);
      setDailyChart(Array.isArray(chartRes) ? chartRes : []);
    } catch (err) {
      console.error('Error fetching report analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed Filter Handler
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      setFiltering(true);
      const updatedSummary = await getSalesSummary(startDate, endDate);
      setSummary(updatedSummary);
    } catch (err) {
      alert('Failed to filter summary. Check server console.');
      console.error('Filter error:', err);
    } finally {
      setFiltering(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics dashboard...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Analytics & Reports</h2>

        {/* Date Filter Form */}
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={filtering}
            style={{ padding: '6px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {filtering ? 'Filtering...' : 'Filter Summary'}
          </button>
        </form>
      </div>

      {/* KPI Cards */}
      <SummaryCards summary={summary} valuation={valuation} />

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <DailySalesChart data={dailyChart} />
        <TopProductsChart products={topProducts} />
      </div>
    </div>
  );
}