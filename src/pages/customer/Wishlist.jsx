// Wishlist page
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMyWishlists, fetchWishlistItems, removeWishlistItem, createWishlist,
} from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

function Wishlist() {
  const dispatch = useAppDispatch();
  const { wishlists, currentItems, status } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchMyWishlists());
  }, [dispatch]);

  useEffect(() => {
    if (wishlists.length > 0) {
      dispatch(fetchWishlistItems(wishlists[0].id));
    }
  }, [wishlists, dispatch]);

  if (status === 'loading') return <Loader text="Loading wishlist..." />;

  if (wishlists.length === 0) {
    return (
      <div className="wishlist-page empty">
        <p>You don't have a wishlist yet.</p>
        <Button onClick={() => dispatch(createWishlist('My Wishlist'))}>Create Wishlist</Button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>

      {currentItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
          {currentItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <h4>{item.product_name}</h4>
              <p>SKU: {item.sku}</p>
              <p>${parseFloat(item.price).toFixed(2)}</p>
              <Button onClick={() => dispatch(addToCart({ variant_id: item.variant_id, quantity: 1 }))}>
                Add to Cart
              </Button>
              <button onClick={() => dispatch(removeWishlistItem({ id: wishlists[0].id, itemId: item.id }))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;