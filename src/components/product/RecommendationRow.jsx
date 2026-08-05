// Displays a horizontal row of recommended products with a heading.
// Reused for all three algorithms (Trending, Related, Also Bought).
import { Link } from 'react-router-dom';

function RecommendationRow({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="recommendation-row">
      <h3>{title}</h3>
      <div className="recommendation-row-track">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="recommendation-row-item">
            <div className="recommendation-row-image">
              {product.featured_image ? (
                <img
                  src={`${import.meta.env.VITE_ASSET_BASE_URL}${product.featured_image}`}
                  alt={product.name}
                />
              ) : (
                <span className="recommendation-row-placeholder">No Image</span>
              )}
            </div>
            <p className="recommendation-row-name">{product.name}</p>
            {product.min_price && (
              <p className="recommendation-row-price">${parseFloat(product.min_price).toFixed(2)}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecommendationRow;