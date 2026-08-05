// Admin page to view audit logs
import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/system/audit-logs', { params: { page, limit: 20 } });
        setLogs(data.data);
        setPagination(data.pagination);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [page]);

  const columns = [
    { key: 'action', label: 'Action' },
    { key: 'table_name', label: 'Table' },
    { key: 'row_id', label: 'Row ID' },
    { key: 'user_name', label: 'Performed By', render: (row) => row.user_name || 'System' },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleString() },
  ];

  if (loading) return <Loader text="Loading audit logs..." />;

  return (
    <div className="audit-logs-page">
      <h2>Audit Logs</h2>
      <Table columns={columns} data={logs} emptyMessage="No audit logs found" />
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default AuditLogs;