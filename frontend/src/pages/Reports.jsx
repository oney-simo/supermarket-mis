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
  const [activeChartPage, setActiveChartPage] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadAllReportData();

    const handleSalesUpdated = () => {
      loadAllReportData();
    };

    window.addEventListener('sales:updated', handleSalesUpdated);
    return () => window.removeEventListener('sales:updated', handleSalesUpdated);
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

  const chartPages = [
    { title: 'Daily Revenue Trend', content: <DailySalesChart data={dailyChart} /> },
    { title: 'Top Selling Products', content: <TopProductsChart products={topProducts} /> }
  ];

  const changeChartPage = (direction) => {
    setActiveChartPage((prev) => {
      if (direction === 'next') {
        return prev === chartPages.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? chartPages.length - 1 : prev - 1;
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading analytics dashboard...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        @keyframes reports-page-enter {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Analytics & Reports</h2>

        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={filtering}
            className="btn btn--blue"
          >
            {filtering ? 'Filtering...' : 'Filter Summary'}
          </button>
        </form>
      </div>

      <SummaryCards summary={summary} valuation={valuation} />

      <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0 }}>{chartPages[activeChartPage].title}</h3>
            <p style={{ marginTop: '4px', color: '#64748b', fontSize: '13px' }}>Page {activeChartPage + 1} of {chartPages.length}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn--ghost" onClick={() => changeChartPage('prev')}>
              Previous
            </button>
            <button type="button" className="btn btn--blue" onClick={() => changeChartPage('next')}>
              Next
            </button>
          </div>
        </div>

        <div key={activeChartPage} style={{ animation: 'reports-page-enter 0.35s ease' }}>
          {chartPages[activeChartPage].content}
        </div>
      </div>
    </div>
  );
}