// Admin page to review and approve/reject pending vendors
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVendors, updateVendorStatus } from '../../features/vendor/vendorSlice';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';

function VendorApprovals() {
  const dispatch = useAppDispatch();
  const { list: vendors, pagination, status } = useAppSelector((state) => state.vendor);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    dispatch(fetchVendors({ status: statusFilter, page, limit: 10 }));
  }, [dispatch, statusFilter, page]);

  function handleStatusChange(id, newStatus) {
    dispatch(updateVendorStatus({ id, status: newStatus }));
  }

  const columns = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <button onClick={() => handleStatusChange(row.id, 'active')}>Approve</button>
          <button onClick={() => handleStatusChange(row.id, 'rejected')}>Reject</button>
          <button onClick={() => handleStatusChange(row.id, 'suspended')}>Suspend</button>
        </>
      ),
    },
  ];

  return (
    <div className="vendor-approvals-page">
      <h2>Vendor Approvals</h2>

      <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="rejected">Rejected</option>
      </select>

      <Table columns={columns} data={vendors} emptyMessage="No vendors found" />
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default VendorApprovals;