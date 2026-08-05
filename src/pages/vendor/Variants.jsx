// Vendor variant management page for a specific product
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchVariants, createVariant } from '../../features/product/productSlice';
import productApi from '../../api/productApi';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';

function VendorVariants() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const { variants, status } = useAppSelector((state) => state.product);

  const [showModal, setShowModal] = useState(false);
  const [sizeValues, setSizeValues] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [formData, setFormData] = useState({
    sku: '', price: '', compare_at_price: '', cost_price: '', weight: '', dimensions: '',
  });

  useEffect(() => {
    dispatch(fetchVariants(productId));
    loadAttributeOptions();
  }, [dispatch, productId]);

  // Loads the available Shoe Size and Color attribute values so the vendor
  // can pick from a dropdown instead of typing free text.
  async function loadAttributeOptions() {
    try {
      const attributesRes = await productApi.listAttributes();
      const attributes = attributesRes.data.data;

      const sizeAttr = attributes.find((a) => a.name === 'Shoe Size');
      const colorAttr = attributes.find((a) => a.name === 'Color');

      if (sizeAttr) {
        const sizeValuesRes = await productApi.listAttributeValues(sizeAttr.id);
        setSizeValues(sizeValuesRes.data.data);
      }
      if (colorAttr) {
        const colorValuesRes = await productApi.listAttributeValues(colorAttr.id);
        setColorValues(colorValuesRes.data.data);
      }
    } catch {
      setSizeValues([]);
      setColorValues([]);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      attribute_value_ids: [selectedSize, selectedColor].filter(Boolean).map((id) => parseInt(id, 10)),
    };

    const result = await dispatch(createVariant({ productId, payload }));
    if (createVariant.fulfilled.match(result)) {
      setShowModal(false);
      setFormData({ sku: '', price: '', compare_at_price: '', cost_price: '', weight: '', dimensions: '' });
      setSelectedSize('');
      setSelectedColor('');
    }
  }

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price', render: (row) => `$${parseFloat(row.price).toFixed(2)}` },
    { key: 'compare_at_price', label: 'Compare Price', render: (row) => row.compare_at_price ? `$${parseFloat(row.compare_at_price).toFixed(2)}` : '-' },
    { key: 'weight', label: 'Weight' },
  ];

  return (
    <div className="vendor-variants-page">
      <div className="page-header">
        <h2>Product Variants</h2>
        <Button onClick={() => setShowModal(true)}>Add Variant</Button>
      </div>

      <Table columns={columns} data={variants} emptyMessage="No variants yet" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Variant">
        <form onSubmit={handleCreate}>
          <InputField label="SKU" name="sku" value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
          <InputField label="Price" type="number" name="price" value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <InputField label="Compare At Price" type="number" name="compare_at_price" value={formData.compare_at_price}
            onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })} />
          <InputField label="Cost Price" type="number" name="cost_price" value={formData.cost_price}
            onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })} />
          <InputField label="Weight" type="number" name="weight" value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
          <InputField label="Dimensions" name="dimensions" value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} />

          {sizeValues.length > 0 && (
            <div className="form-field">
              <label>Shoe Size</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Select size (optional)</option>
                {sizeValues.map((v) => (
                  <option key={v.id} value={v.id}>{v.value}</option>
                ))}
              </select>
            </div>
          )}

          {colorValues.length > 0 && (
            <div className="form-field">
              <label>Color</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">Select color (optional)</option>
                {colorValues.map((v) => (
                  <option key={v.id} value={v.id}>{v.value}</option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" disabled={status === 'loading'}>Create Variant</Button>
        </form>
      </Modal>
    </div>
  );
}

export default VendorVariants;