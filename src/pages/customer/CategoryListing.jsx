// Dedicated category listing page with a sidebar filter panel (Gender, Size,
// Price Range, Brand, Color) alongside the product grid. Used for categories
// like Shoes where shoppers need to narrow down results heavily.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from '../../features/product/productSlice';
import { fetchCategories } from '../../features/catalog/catalogSlice';
import ShoeFilterSidebar from '../../components/product/ShoeFilterSidebar';
import ProductCard from '../../components/product/ProductCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

function CategoryListing() {
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { list: products, pagination, status } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.catalog);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: '', size: '', min_price: '', max_price: '', brand: '', color: '',
  });

  const currentCategory = categories.find((c) => c.id === Number(categoryId));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      status: 'published',
      category_id: categoryId,
      page,
      limit: 12,
      ...filters,
    }));
  }, [dispatch, categoryId, page, filters]);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="category-listing-page">
      <h2 className="section-heading">{currentCategory?.name || 'Products'}</h2>

      <div className="category-listing-layout">
        <ShoeFilterSidebar categoryId={categoryId} filters={filters} onChange={handleFilterChange} />

        <div className="category-listing-main">
          {status === 'loading' ? (
            <Loader text="Loading products..." />
          ) : products.length === 0 ? (
            <p className="empty-state">No products match your filters. Try adjusting them.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default CategoryListing;