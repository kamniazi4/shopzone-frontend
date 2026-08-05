// Horizontal scrollable "Best Sellers" strip specifically for the Home & Kitchen
// category. Clicking any item navigates to that product's full detail page,
// where the customer can view all images and add it to the cart - same as
// clicking any product from the regular grid.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../../api/productApi';

function HomeKitchenStrip({ category }) {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productApi.listProducts({
          category_id: category.id,
          status: 'published',
          limit: 15,
        });
        setProducts(res.data.data);
      } catch {
        setProducts([]);
      }
    }
    loadProducts();
  }, [category.id]);

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  if (products.length === 0) return null;

  return (
    <div className="hk-strip-box">
      <h3>Best Sellers in {category.name}</h3>

      <div className="hk-strip-wrapper">
        <button className="hk-strip-arrow hk-strip-arrow-left" onClick={scrollLeft} aria-label="Scroll left">
          ‹
        </button>

        <div className="hk-strip-track" ref={scrollRef}>
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="hk-strip-item" title={product.name}>
              {product.featured_image ? (
                <img
                  src={`${import.meta.env.VITE_ASSET_BASE_URL}${product.featured_image}`}
                  alt={product.name}
                />
              ) : (
                <span className="hk-strip-placeholder">No Image</span>
              )}
            </Link>
          ))}
        </div>

        <button className="hk-strip-arrow hk-strip-arrow-right" onClick={scrollRight} aria-label="Scroll right">
          ›
        </button>
      </div>
    </div>
  );
}

export default HomeKitchenStrip;