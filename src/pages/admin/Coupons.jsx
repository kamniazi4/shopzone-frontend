// Admin page to manage coupons
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCoupons, createCoupon } from '../../features/promotion/promotionSlice';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

function Coupons() {
  const dispatch = useAppDispatch();
  const { coupons, status } = useAppSelector((state) => state.promotion);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discount_type: 'percentage', discount_value: '',
    min_order_amount: '', max_discount_amount: '', usage_limit: '',
  });

  useEffect(() => {
    dispatch(fetchCoupons({ limit: 20 }));
  }, [dispatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit, 10) : null,
    };
    const result = await dispatch(createCoupon(payload));
    if (createCoupon.fulfilled.match(result)) {
      setShowModal(false);
      setFormData({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_discount_amount: '', usage_limit: '' });
    }
  }

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'discount_type', label: 'Type' },
    { key: 'discount_value', label: 'Value' },
    { key: 'usage_limit', label: 'Usage Limit', render: (row) => row.usage_limit || 'Unlimited' },
  ];

  return (
    <div className="coupons-page">
      <div className="page-header">
        <h2>Coupons</h2>
        <Button onClick={() => setShowModal(true)}>Create Coupon</Button>
      </div>

      <Table columns={columns} data={coupons} emptyMessage="No coupons yet" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Coupon">
        <form onSubmit={handleSubmit}>
          <InputField label="Code" name="code" value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
          <SelectField
            label="Discount Type"
            name="discount_type"
            value={formData.discount_type}
            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed_amount', label: 'Fixed Amount' },
            ]}
          />
          <InputField label="Discount Value" type="number" name="discount_value" value={formData.discount_value}
            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })} required />
          <InputField label="Min Order Amount" type="number" name="min_order_amount" value={formData.min_order_amount}
            onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })} />
          <InputField label="Max Discount Amount" type="number" name="max_discount_amount" value={formData.max_discount_amount}
            onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })} />
          <InputField label="Usage Limit" type="number" name="usage_limit" value={formData.usage_limit}
            onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })} />

          <Button type="submit" disabled={status === 'loading'}>Create</Button>
        </form>
      </Modal>
    </div>
  );
}

export default Coupons;