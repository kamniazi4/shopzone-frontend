// Admin page to manage categories and attributes
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchCategories, createCategory, deleteCategory,
  fetchAttributes, createAttribute,
} from '../../features/catalog/catalogSlice';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

function CategoriesAttributes() {
  const dispatch = useAppDispatch();
  const { categories, attributes } = useAppSelector((state) => state.catalog);

  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [attributeType, setAttributeType] = useState('select');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAttributes());
  }, [dispatch]);

  async function handleAddCategory(e) {
    e.preventDefault();
    await dispatch(createCategory({ name: categoryName, parent_id: parentId || null }));
    setCategoryName('');
    setParentId('');
  }

  async function handleAddAttribute(e) {
    e.preventDefault();
    await dispatch(createAttribute({ name: attributeName, type: attributeType }));
    setAttributeName('');
  }

  const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <button onClick={() => dispatch(deleteCategory(row.id))}>Delete</button>,
    },
  ];

  const attributeColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
  ];

  return (
    <div className="categories-attributes-page">
      <h2>Categories</h2>
      <form onSubmit={handleAddCategory} className="inline-form">
        <InputField label="Category Name" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
        <SelectField
          label="Parent Category"
          name="parentId"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Button type="submit">Add Category</Button>
      </form>
      <Table columns={categoryColumns} data={categories} emptyMessage="No categories yet" />

      <h2>Attributes</h2>
      <form onSubmit={handleAddAttribute} className="inline-form">
        <InputField label="Attribute Name" name="attributeName" value={attributeName} onChange={(e) => setAttributeName(e.target.value)} required />
        <SelectField
          label="Type"
          name="attributeType"
          value={attributeType}
          onChange={(e) => setAttributeType(e.target.value)}
          options={[
            { value: 'select', label: 'Select' },
            { value: 'text', label: 'Text' },
            { value: 'color', label: 'Color' },
          ]}
        />
        <Button type="submit">Add Attribute</Button>
      </form>
      <Table columns={attributeColumns} data={attributes} emptyMessage="No attributes yet" />
    </div>
  );
}

export default CategoriesAttributes;