// Displays a single product summary in a grid/list (storefront usage)
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.featured_image ? (
          <img src={`${import.meta.env.VITE_ASSET_BASE_URL}${product.featured_image}`} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">No Image</div>
        )}
      </div>
      <div className="product-card-info">
        <h4>{product.name}</h4>
        <p className="product-card-vendor">{product.vendor_name}</p>
        <p className="product-card-price">
          {product.min_price ? `$${parseFloat(product.min_price).toFixed(2)}` : 'Price not set'}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;