// Product detail page - shows variants, images, and lets the customer add to cart
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProductById, clearCurrentProduct } from '../../features/product/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { addWishlistItem, fetchMyWishlists, createWishlist } from '../../features/wishlist/wishlistSlice';
import VariantSelector from '../../components/product/VariantSelector';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import recommendationApi from '../../api/recommendationApi';
import RecommendationRow from '../../components/product/RecommendationRow';
import ProductImageZoom from '../../components/product/ProductImageZoom';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentProduct, status } = useAppSelector((state) => state.product);
  const { accessToken } = useAppSelector((state) => state.auth);
  const { wishlists } = useAppSelector((state) => state.wishlist);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [alsoBoughtProducts, setAlsoBoughtProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct?.variants?.length > 0 && !selectedVariantId) {
      setSelectedVariantId(currentProduct.variants[0].id);
    }
  }, [currentProduct, selectedVariantId]);

  useEffect(() => {
    if (accessToken) dispatch(fetchMyWishlists());
  }, [accessToken, dispatch]);

  // Record this view for trending calculation, and load related/co-purchase recommendations
  useEffect(() => {
    if (!id) return;

    recommendationApi.recordView(id).catch(() => {});

    recommendationApi.getRelated(id, 8)
      .then((res) => setRelatedProducts(res.data.data))
      .catch(() => setRelatedProducts([]));

    recommendationApi.getAlsoBought(id, 8)
      .then((res) => setAlsoBoughtProducts(res.data.data))
      .catch(() => setAlsoBoughtProducts([]));
  }, [id]);

  // Clears the feedback message automatically after a few seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  if (status === 'loading' || !currentProduct) {
    return <Loader text="Loading product..." />;
  }

  async function handleAddToCart() {
    const result = await dispatch(addToCart({ variant_id: selectedVariantId, quantity }));
    if (addToCart.fulfilled.match(result)) {
      setFeedbackMessage('Item added to cart!');
    } else {
      setFeedbackMessage('Failed to add item. Please try again.');
    }
  }

  async function handleAddToWishlist() {
    if (wishlists.length > 0) {
      await dispatch(addWishlistItem({ id: wishlists[0].id, variant_id: selectedVariantId }));
      setFeedbackMessage('Item added to wishlist!');
    } else {
      // No wishlist exists yet for this user, so create one first, then add the item
      const result = await dispatch(createWishlist('My Wishlist'));
      if (createWishlist.fulfilled.match(result)) {
        await dispatch(addWishlistItem({ id: result.payload.id, variant_id: selectedVariantId }));
        setFeedbackMessage('Item added to wishlist!');
      }
    }
  }

  return (
    <div className="product-details-page">
      <div className="product-images">
  {currentProduct.images?.map((img) => (
    <ProductImageZoom
      key={img.id}
      src={`${import.meta.env.VITE_ASSET_BASE_URL}${img.image_url}`}
      alt={currentProduct.name}
    />
  ))}
</div>

      <div className="product-info">
        <h1>{currentProduct.name}</h1>
        <p className="product-description">{currentProduct.description}</p>

        <div className="product-rating">
          Rating: {currentProduct.rating.average_rating} ({currentProduct.rating.total_reviews} reviews)
        </div>

        <VariantSelector
          variants={currentProduct.variants}
          selectedVariantId={selectedVariantId}
          onSelect={setSelectedVariantId}
        />

        <div className="quantity-selector">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          />
        </div>

        {feedbackMessage && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>{feedbackMessage}</p>
        )}

        <div className="product-actions">
          <Button onClick={handleAddToCart} disabled={!accessToken}>Add to Cart</Button>
          <Button variant="secondary" onClick={handleAddToWishlist} disabled={!accessToken}>
            Add to Wishlist
          </Button>
        </div>

        {!accessToken && <p><Link to="/login">Login</Link> to add items to your cart.</p>}

        <Link to={`/products/${id}/reviews`}>View all reviews</Link>
      </div>

      {/* Algorithm 2: Content-based - related products from the same category */}
      <RecommendationRow title="Related Products" products={relatedProducts} />

      {/* Algorithm 3: Collaborative filtering - "People Also Bought" via co-purchase data */}
      <RecommendationRow title="People Also Bought" products={alsoBoughtProducts} />
    </div>
  );
}

export default ProductDetails;