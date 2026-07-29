import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../api/activityLogApi';
import LogFilterBar from '../components/activityLogs/LogFilterBar';
import LogTable from '../components/activityLogs/LogTable';
import LogPagination from '../components/activityLogs/LogPagination';
import LogDetailModal from '../components/activityLogs/LogDetailModal';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });

  // Selected Log for Inspector Modal
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [filters.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActivityLogs(filters);

      if (response.success) {
        setLogs(response.data || []);
        setPagination(response.pagination || { page: 1, limit: 20, total: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activity logs.');
      console.error('Activity log error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleResetFilters = () => {
    const defaultFilters = { module: '', action: '', startDate: '', endDate: '', page: 1, limit: 20 };
    setFilters(defaultFilters);
    getActivityLogs(defaultFilters).then((res) => {
      if (res.success) {
        setLogs(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 20, total: 0 });
      }
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>System Activity Logs</h2>

      {/* Filter Component */}
      <LogFilterBar
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading activity logs...</p>
      ) : (
        <>
          {/* Table Component */}
          <LogTable logs={logs} onViewDetails={(log) => setSelectedLog(log)} />

          {/* Pagination Component */}
          <LogPagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      {/* Log Detail Modal Component */}
      <LogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}