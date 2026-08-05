// Displays products grouped by category in Amazon-style "collection" boxes.
// Each box shows a heading and a small grid of product tiles for that category.
// Every category with at least one published product gets its own box - no limit.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';

function CategoryShowcase({ categories, onCategorySelect }) {
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowcaseProducts() {
      if (!categories || categories.length === 0) {
        setLoading(false);
        return;
      }

      const results = await Promise.all(
        categories.map((cat) =>
          productApi.listProducts({ category_id: cat.id, status: 'published', limit: 4 })
            .then((res) => ({ categoryId: cat.id, products: res.data.data }))
            .catch(() => ({ categoryId: cat.id, products: [] }))
        )
      );

      const grouped = {};
      results.forEach(({ categoryId, products }) => {
        grouped[categoryId] = products;
      });

      setCategoryProducts(grouped);
      setLoading(false);
    }

    loadShowcaseProducts();
  }, [categories]);

  if (loading) return null;

  const categoriesWithProducts = categories.filter((cat) => categoryProducts[cat.id]?.length > 0);

  if (categoriesWithProducts.length === 0) return null;

  return (
    <div className="category-showcase-grid">
      {categoriesWithProducts.map((cat) => (
        <div key={cat.id} className="category-showcase-box">
          <h3>{cat.name}</h3>

          <div className="category-showcase-tiles">
            {categoryProducts[cat.id].map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="category-showcase-tile">
                <div className="category-showcase-tile-image">
                  {product.featured_image ? (
                    <img
                      src={`${import.meta.env.VITE_ASSET_BASE_URL}${product.featured_image}`}
                      alt={product.name}
                    />
                  ) : (
                    <span className="category-showcase-placeholder">No Image</span>
                  )}
                </div>
                <p>{product.name}</p>
              </Link>
            ))}
          </div>

          <button
            className="category-showcase-see-more"
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            See more
          </button>
        </div>
      ))}
    </div>
  );
}

export default CategoryShowcase;