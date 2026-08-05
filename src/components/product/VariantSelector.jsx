// Lets the customer pick a variant based on its attributes (e.g. size, color)
function VariantSelector({ variants, selectedVariantId, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="variant-selector">
      <label>Select Option:</label>
      <div className="variant-options">
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={`variant-option ${selectedVariantId === variant.id ? 'selected' : ''}`}
            onClick={() => onSelect(variant.id)}
          >
            {variant.sku} - ${parseFloat(variant.price).toFixed(2)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VariantSelector;
