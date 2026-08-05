// Sidebar filter panel for category listing pages - Gender, Size, Price Range,
// Brand, and Color. Options are loaded dynamically based on actual product data
// for the given category, and selections are passed up to the parent as filters.
import { useEffect, useState } from 'react';
import productApi from '../../api/productApi';

const COLOR_SWATCHES = {
  Black: '#000000',
  White: '#ffffff',
  Grey: '#888888',
  Blue: '#2563eb',
  Red: '#dc2626',
  Brown: '#7c4a2d',
};

function ShoeFilterSidebar({ categoryId, filters, onChange }) {
  const [options, setOptions] = useState({
    brands: [], genders: [], sizes: [], colors: [], price_range: { min_price: 0, max_price: 0 },
  });

  useEffect(() => {
    if (!categoryId) return;
    productApi.getFilterOptions(categoryId)
      .then((res) => setOptions(res.data.data))
      .catch(() => {});
  }, [categoryId]);

  function toggleValue(key, value) {
    const current = filters[key];
    onChange({ ...filters, [key]: current === value ? '' : value });
  }

  function handlePriceChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <aside className="filter-sidebar">
      {options.genders.length > 0 && (
        <div className="filter-section">
          <h4>Gender</h4>
          {options.genders.map((g) => (
            <label key={g} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={filters.gender === g}
                onChange={() => toggleValue('gender', g)}
              />
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      )}

      {options.sizes.length > 0 && (
        <div className="filter-section">
          <h4>Shoe Size</h4>
          <div className="filter-size-grid">
            {options.sizes.map((s) => (
              <button
                key={s}
                className={`filter-size-btn ${filters.size === s ? 'selected' : ''}`}
                onClick={() => toggleValue('size', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="filter-price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => handlePriceChange('min_price', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => handlePriceChange('max_price', e.target.value)}
          />
        </div>
        {options.price_range?.min_price && (
          <p className="filter-price-hint">
            Range: ${parseFloat(options.price_range.min_price).toFixed(0)} - ${parseFloat(options.price_range.max_price).toFixed(0)}
          </p>
        )}
      </div>

      {options.brands.length > 0 && (
        <div className="filter-section">
          <h4>Brand</h4>
          {options.brands.map((b) => (
            <label key={b} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={filters.brand === b}
                onChange={() => toggleValue('brand', b)}
              />
              {b}
            </label>
          ))}
        </div>
      )}

      {options.colors.length > 0 && (
        <div className="filter-section">
          <h4>Color</h4>
          <div className="filter-color-grid">
            {options.colors.map((c) => (
              <button
                key={c}
                className={`filter-color-swatch ${filters.color === c ? 'selected' : ''}`}
                style={{ backgroundColor: COLOR_SWATCHES[c] || '#ccc' }}
                title={c}
                onClick={() => toggleValue('color', c)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        className="filter-clear-btn"
        onClick={() => onChange({ gender: '', size: '', min_price: '', max_price: '', brand: '', color: '' })}
      >
        Clear All Filters
      </button>
    </aside>
  );
}

export default ShoeFilterSidebar;