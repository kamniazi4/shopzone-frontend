// Vendor shipping settings page
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import vendorApi from '../../api/vendorApi';
import shippingApi from '../../api/shippingApi';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';

function VendorShippingSettings() {
  const { user } = useAppSelector((state) => state.auth);
  const vendorId = user?.vendor_id;

  const [settings, setSettings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ shipping_provider_id: '', flat_rate: '' });

  async function loadData() {
    if (!vendorId) return;
    try {
      const [settingsRes, providersRes] = await Promise.all([
        vendorApi.listShippingSettings(vendorId),
        shippingApi.listProviders(),
      ]);
      setSettings(settingsRes.data.data);
      setProviders(providersRes.data.data);
    } catch (err) {
      console.error('Failed to load shipping settings:', err?.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [vendorId]);

  async function handleSubmit(e) {
    e.preventDefault();
    await vendorApi.addShippingSetting(vendorId, {
      shipping_provider_id: parseInt(formData.shipping_provider_id, 10),
      flat_rate: parseFloat(formData.flat_rate),
    });
    setShowModal(false);
    setFormData({ shipping_provider_id: '', flat_rate: '' });
    loadData();
  }

  async function handleDelete(settingId) {
    await vendorApi.deleteShippingSetting(vendorId, settingId);
    loadData();
  }

  const columns = [
    { key: 'provider_name', label: 'Provider' },
    { key: 'flat_rate', label: 'Flat Rate', render: (row) => `$${parseFloat(row.flat_rate).toFixed(2)}` },
    { key: 'is_enabled', label: 'Enabled', render: (row) => (row.is_enabled ? 'Yes' : 'No') },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <button onClick={() => handleDelete(row.id)}>Remove</button>,
    },
  ];

  return (
    <div className="vendor-shipping-page">
      <div className="page-header">
        <h2>Shipping Settings</h2>
        <Button onClick={() => setShowModal(true)}>Add Shipping Provider</Button>
      </div>

      <Table columns={columns} data={settings} emptyMessage="No shipping settings configured" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Shipping Provider">
        <form onSubmit={handleSubmit}>
          <label>Provider:</label>
          <select
            value={formData.shipping_provider_id}
            onChange={(e) => setFormData({ ...formData, shipping_provider_id: e.target.value })}
            required
          >
            <option value="">Select provider</option>
            {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <InputField label="Flat Rate" type="number" name="flat_rate" value={formData.flat_rate}
            onChange={(e) => setFormData({ ...formData, flat_rate: e.target.value })} required />

          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </div>
  );
}

export default VendorShippingSettings;