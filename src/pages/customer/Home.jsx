// Storefront home page - hero banner, category showcase boxes for every category, and product grid
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from '../../features/product/productSlice';
import { fetchCategories } from '../../features/catalog/catalogSlice';
import { fetchActiveBanners } from '../../features/banner/bannerSlice';
import ProductCard from '../../components/product/ProductCard';
import CategoryShowcase from '../../components/product/CategoryShowcase';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import HomeKitchenStrip from '../../components/product/HomeKitchenStrip';
import recommendationApi from '../../api/recommendationApi';
import RecommendationRow from '../../components/product/RecommendationRow';

function Home() {
  const dispatch = useAppDispatch();
  const { list: products, pagination, status } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.catalog);
  const { banners } = useAppSelector((state) => state.banner);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchActiveBanners());
  }, [dispatch]);

  const mainBanner = banners.find((b) => b.position === 'main');
  const sideBanners = banners.filter((b) => b.position !== 'main');

  // Home & Kitchen and Sports & Outdoors get their own horizontal strip design,
  // so they are pulled out separately and excluded from the regular showcase boxes below.
  const homeKitchenCategory = categories.find(
    (cat) => cat.name.trim().toLowerCase() === 'home & kitchen' || cat.slug === 'home-kitchen'
  );
  const sportsCategory = categories.find(
    (cat) => cat.name.trim().toLowerCase() === 'sports & outdoors' || cat.slug === 'sports-outdoors'
  );
  const otherCategories = categories.filter(
    (cat) => cat.id !== homeKitchenCategory?.id && cat.id !== sportsCategory?.id
  );

  // Pull out these 4 specific categories to display together in their own row.
  // Match by slug (stable identifier) rather than display name, to avoid
  // mismatches from "&" vs "and" or other formatting differences.
  const featuredSlugs = ['shoes', 'watch-and-jewelry', 'toys-games', 'grocery'];
  const featuredCategories = categories.filter((cat) => featuredSlugs.includes(cat.slug));
  const remainingCategories = otherCategories.filter((cat) => !featuredSlugs.includes(cat.slug));

  // The 9 main categories that already have their own dedicated sections above.
  // Products belonging ONLY to these categories are excluded from "Recommended
  // for you", so that section instead surfaces new/uncategorized/viral products.
  const MAIN_CATEGORY_NAMES = [
    'beauty & personal care', 'books', 'clothing', 'electronics', 'grocery',
    'home & kitchen', 'sports & outdoors', 'toys & games', 'watch and jewelry',
  ];
  const mainCategoryIds = categories
    .filter((cat) => MAIN_CATEGORY_NAMES.includes(cat.name.trim().toLowerCase()))
    .map((cat) => cat.id);
  const mainCategoryIdsKey = mainCategoryIds.join(',');

  useEffect(() => {
    const params = { status: 'published', search, category_id: categoryId, page, limit: 12 };

    // Only apply the exclusion when showing the general "Recommended for you" feed
    // (i.e. no specific category or search is selected)
    if (!categoryId && !search && mainCategoryIds.length > 0) {
      params.exclude_category_ids = mainCategoryIdsKey;
    }

    dispatch(fetchProducts(params));
  }, [dispatch, search, categoryId, page, mainCategoryIdsKey]);

  // Algorithm 1: Trending/Viral products - loaded once on mount
  useEffect(() => {
    recommendationApi.getTrending(10)
      .then((res) => setTrendingProducts(res.data.data))
      .catch(() => setTrendingProducts([]));
  }, []);

  function handleCategorySelect(catId) {
    setCategoryId(String(catId));
    setPage(1);
    document.querySelector('.section-heading')?.scrollIntoView({ behavior: 'smooth' });
  }

  const showShowcase = !search && !categoryId;

  return (
    <div className="home-page">
      {/* Announcement strip */}
      <div className="announcement-bar">
        <span>⚡ Flash Sale Live — Up to 50% Off!</span>
        <span className="announcement-right">
          Free delivery on Rs 3000+ &nbsp;|&nbsp; Cash on Delivery available
        </span>
      </div>

      {/* Hero section: main promo (from DB) + side cards (from DB) */}
      <div className="hero-section">
        {mainBanner && (
          <div className="hero-main">
            {mainBanner.badge_text && <span className="hero-badge">⚡ {mainBanner.badge_text}</span>}
            <h1>
              {mainBanner.title}
              {mainBanner.highlight_text && <><br /><span className="hero-highlight">{mainBanner.highlight_text}</span></>}
            </h1>
            {mainBanner.subtitle && <p>{mainBanner.subtitle}</p>}
          </div>
        )}

        <div className="hero-side">
          {sideBanners.map((banner) => (
            <div key={banner.id} className={`promo-card promo-card-${banner.color_theme}`}>
              {banner.badge_text && <span className="promo-tag">{banner.badge_text}</span>}
              <h3>{banner.title}</h3>
              {banner.subtitle && <p>{banner.subtitle}</p>}
              {banner.button_text && <button className="promo-btn">{banner.button_text} ›</button>}
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges strip */}
      <div className="trust-strip">
        <div className="trust-item">
          <span className="trust-icon">🚚</span>
          <div>
            <strong>Free Shipping</strong>
            <p>On orders above Rs 3,000</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🛡️</span>
          <div>
            <strong>100% Original</strong>
            <p>All products guaranteed</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">↩️</span>
          <div>
            <strong>Easy Returns</strong>
            <p>7-day return policy</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">⚡</span>
          <div>
            <strong>Fast Delivery</strong>
            <p>Same-day shipping</p>
          </div>
        </div>
      </div>

      {/* Search and category filter */}
      <div className="home-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Shoes, Watch and Jewelry, Toys and Games, Grocery - shown together as their own row */}
      {showShowcase && featuredCategories.length > 0 && (
        <CategoryShowcase categories={featuredCategories} onCategorySelect={handleCategorySelect} />
      )}

      {/* All remaining categories appear as grid boxes */}
      {showShowcase && (
        <CategoryShowcase categories={remainingCategories} onCategorySelect={handleCategorySelect} />
      )}

      {/* Home & Kitchen strip appears after the grid boxes */}
      {showShowcase && homeKitchenCategory && (
        <HomeKitchenStrip category={homeKitchenCategory} />
      )}

      {/* Sports & Outdoors gets the same horizontal strip design as Home & Kitchen */}
      {showShowcase && sportsCategory && (
        <HomeKitchenStrip category={sportsCategory} />
      )}

      {/* Algorithm 1: Trending/Viral products based on recent view activity */}
      {showShowcase && (
        <RecommendationRow title="🔥 Trending Now" products={trendingProducts} />
      )}

      <h2 className="section-heading">
        {categoryId ? categories.find((c) => c.id === Number(categoryId))?.name : 'Recommended for you'}
      </h2>

      {status === 'loading' ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <p className="empty-state">No products found. Try a different search or category.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default Home;