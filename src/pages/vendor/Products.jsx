// Vendor product management page
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts, createProduct, updateProductStatus, deleteProduct } from '../../features/product/productSlice';
import { fetchCategories, createCategory } from '../../features/catalog/catalogSlice';
import productApi from '../../api/productApi';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import Pagination from '../../components/common/Pagination';

// Categories that need the extra Brand/Gender/Size/Color fields.
// Add or remove category names here to control which categories show these fields.
const CATEGORIES_WITH_VARIANT_FIELDS = ['shoes', 'clothing', 'watch and jewelry'];

function VendorProducts() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: products, pagination, status } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.catalog);

  const vendorId = user?.vendor_id;
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', short_description: '', sku: '', price: '',
    brand: '', gender: '',
  });

  const [sizeValues, setSizeValues] = useState([]);
  const [colorValues, setColorValues] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [attributesLoaded, setAttributesLoaded] = useState(false);

  useEffect(() => {
    if (vendorId) dispatch(fetchProducts({ vendor_id: vendorId, page, limit: 10 }));
    dispatch(fetchCategories());
  }, [dispatch, vendorId, page]);

  // Whether the currently typed category name matches one that needs extra fields
  const showVariantFields = CATEGORIES_WITH_VARIANT_FIELDS.includes(
    categoryName.trim().toLowerCase()
  );

  // Loads Shoe Size / Color attribute values once, the first time they're needed
  async function ensureAttributeOptionsLoaded() {
    if (attributesLoaded) return;
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
      setAttributesLoaded(true);
    } catch {
      setSizeValues([]);
      setColorValues([]);
    }
  }

  function handleCategoryNameChange(value) {
    setCategoryName(value);
    if (CATEGORIES_WITH_VARIANT_FIELDS.includes(value.trim().toLowerCase())) {
      ensureAttributeOptionsLoaded();
    }
  }

  async function resolveCategoryId(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const existing = categories.find(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) return existing.id;

    const result = await dispatch(createCategory({ name: trimmedName }));
    if (createCategory.fulfilled.match(result)) {
      return result.payload.id;
    }
    return null;
  }

  async function handleCreate(e) {
    e.preventDefault();

    const categoryId = await resolveCategoryId(categoryName);

    const attributeValueIds = [selectedSize, selectedColor]
      .filter(Boolean)
      .map((id) => parseInt(id, 10));

    const result = await dispatch(createProduct({
      ...formData,
      vendor_id: vendorId,
      price: parseFloat(formData.price),
      category_ids: categoryId ? [categoryId] : [],
      attribute_value_ids: attributeValueIds,
    }));

    if (createProduct.fulfilled.match(result)) {
      const newProductId = result.payload.id;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('category', 'general');
        imageFormData.append('is_featured', 'true');
        await productApi.uploadImage(newProductId, imageFormData);
      }

      setShowModal(false);
      setFormData({
        name: '', description: '', short_description: '', sku: '', price: '',
        brand: '', gender: '',
      });
      setCategoryName('');
      setSelectedSize('');
      setSelectedColor('');
      setImageFile(null);
      dispatch(fetchProducts({ vendor_id: vendorId, page, limit: 10 }));
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <Link to={`/vendor/products/${row.id}/variants`}>Variants</Link>
          {' | '}
          <select
            value={row.status}
            onChange={(e) => dispatch(updateProductStatus({ id: row.id, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="disabled">Disabled</option>
          </select>
          {' | '}
          <button onClick={() => dispatch(deleteProduct(row.id))}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div className="vendor-products-page">
      <div className="page-header">
        <h2>My Products</h2>
        <Button onClick={() => setShowModal(true)}>Add Product</Button>
      </div>

      <Table columns={columns} data={products} emptyMessage="No products yet" />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Product">
        <form onSubmit={handleCreate}>
          <InputField label="Name" name="name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <InputField label="SKU" name="sku" value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          <InputField label="Price" type="number" name="price" value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <TextAreaField label="Short Description" name="short_description" value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} />
          <TextAreaField label="Description" name="description" value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <InputField
            label="Category (type any name - existing or new, e.g. Shoes)"
            name="categoryName"
            value={categoryName}
            onChange={(e) => handleCategoryNameChange(e.target.value)}
          />

          {/* These fields only appear when the typed category needs them (e.g. Shoes) */}
          {showVariantFields && (
            <>
              <InputField
                label="Brand (e.g. Nike)"
                name="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />

              <div className="form-field">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {sizeValues.length > 0 && (
                <div className="form-field">
                  <label>Size</label>
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
            </>
          )}

          <div className="form-field">
            <label>Product Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <Button type="submit" disabled={status === 'loading'}>Create Product</Button>
        </form>
      </Modal>
    </div>
  );
}

export default VendorProducts;