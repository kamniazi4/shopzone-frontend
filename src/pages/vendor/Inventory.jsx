// Vendor inventory management page
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchWarehouses, fetchInventory, upsertInventory, adjustInventory } from '../../features/inventory/inventorySlice';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';

function VendorInventory() {
  const dispatch = useAppDispatch();
  const { warehouses, inventoryList, status } = useAppSelector((state) => state.inventory);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ warehouse_id: '', variant_id: '', quantity_on_hand: '' });

  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchInventory());
  }, [dispatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(upsertInventory({
      warehouse_id: parseInt(formData.warehouse_id, 10),
      variant_id: parseInt(formData.variant_id, 10),
      quantity_on_hand: parseInt(formData.quantity_on_hand, 10),
    }));
    if (upsertInventory.fulfilled.match(result)) {
      setShowModal(false);
      setFormData({ warehouse_id: '', variant_id: '', quantity_on_hand: '' });
    }
  }

  function handleAdjust(id, delta) {
    dispatch(adjustInventory({ id, payload: { quantity: delta, type: delta > 0 ? 'restock' : 'adjustment' } }));
  }

  const columns = [
    { key: 'variant_sku', label: 'SKU' },
    { key: 'warehouse_name', label: 'Warehouse' },
    { key: 'quantity_on_hand', label: 'On Hand' },
    { key: 'quantity_reserved', label: 'Reserved' },
    {
      key: 'actions',
      label: 'Adjust',
      render: (row) => (
        <>
          <button onClick={() => handleAdjust(row.id, 10)}>+10</button>
          <button onClick={() => handleAdjust(row.id, -10)}>-10</button>
        </>
      ),
    },
  ];

  return (
    <div className="vendor-inventory-page">
      <div className="page-header">
        <h2>Inventory</h2>
        <Button onClick={() => setShowModal(true)}>Add Stock Record</Button>
      </div>

      <Table columns={columns} data={inventoryList} emptyMessage="No inventory records" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Stock Record">
        <form onSubmit={handleSubmit}>
          <label>Warehouse:</label>
          <select
            value={formData.warehouse_id}
            onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
            required
          >
            <option value="">Select warehouse</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>

          <InputField label="Variant ID" type="number" name="variant_id" value={formData.variant_id}
            onChange={(e) => setFormData({ ...formData, variant_id: e.target.value })} required />
          <InputField label="Quantity On Hand" type="number" name="quantity_on_hand" value={formData.quantity_on_hand}
            onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })} required />

          <Button type="submit" disabled={status === 'loading'}>Save</Button>
        </form>
      </Modal>
    </div>
  );
}

export default VendorInventory;