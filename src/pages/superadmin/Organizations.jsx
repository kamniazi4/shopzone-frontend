// Superadmin page to manage organizations
import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });

  async function loadOrganizations() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/organizations', { params: { page, limit: 10 } });
      setOrganizations(data.data);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrganizations();
  }, [page]);

  async function handleSubmit(e) {
    e.preventDefault();
    await axiosClient.post('/organizations', formData);
    setShowModal(false);
    setFormData({ name: '', code: '' });
    loadOrganizations();
  }

  async function handleDelete(id) {
    await axiosClient.delete(`/organizations/${id}`);
    loadOrganizations();
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <button onClick={() => handleDelete(row.id)}>Delete</button>,
    },
  ];

  if (loading) return <Loader text="Loading organizations..." />;

  return (
    <div className="organizations-page">
      <div className="page-header">
        <h2>Organizations</h2>
        <Button onClick={() => setShowModal(true)}>Add Organization</Button>
      </div>

      <Table columns={columns} data={organizations} emptyMessage="No organizations yet" />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Organization">
        <form onSubmit={handleSubmit}>
          <InputField label="Name" name="name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <InputField label="Code" name="code" value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Organizations;