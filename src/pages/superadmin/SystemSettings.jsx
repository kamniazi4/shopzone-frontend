// Superadmin page to manage system-wide settings
import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import Loader from '../../components/common/Loader';

function SystemSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ key_name: '', value_data: '', description: '' });

  async function loadSettings() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/system/settings');
      setSettings(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await axiosClient.put(`/system/settings/${formData.key_name}`, {
      value_data: formData.value_data,
      description: formData.description,
    });
    setShowModal(false);
    setFormData({ key_name: '', value_data: '', description: '' });
    loadSettings();
  }

  async function handleDelete(key) {
    await axiosClient.delete(`/system/settings/${key}`);
    loadSettings();
  }

  const columns = [
    { key: 'key_name', label: 'Key' },
    { key: 'value_data', label: 'Value' },
    { key: 'description', label: 'Description' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <button onClick={() => handleDelete(row.key_name)}>Delete</button>,
    },
  ];

  if (loading) return <Loader text="Loading settings..." />;

  return (
    <div className="system-settings-page">
      <div className="page-header">
        <h2>System Settings</h2>
        <Button onClick={() => setShowModal(true)}>Add Setting</Button>
      </div>

      <Table columns={columns} data={settings} emptyMessage="No settings configured" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Setting">
        <form onSubmit={handleSubmit}>
          <InputField label="Key Name" name="key_name" value={formData.key_name}
            onChange={(e) => setFormData({ ...formData, key_name: e.target.value })} required />
          <TextAreaField label="Value" name="value_data" value={formData.value_data}
            onChange={(e) => setFormData({ ...formData, value_data: e.target.value })} />
          <InputField label="Description" name="description" value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </div>
  );
}

export default SystemSettings;