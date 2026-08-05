// Shopping cart page
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMyCart, updateCartItemQuantity, removeCartItem,
} from '../../features/cart/cartSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, status } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchMyCart());
  }, [dispatch]);

  if (status === 'loading') return <Loader text="Loading cart..." />;

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <p>Your cart is empty.</p>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.product_name} />
            <div className="cart-item-details">
              <h4>{item.product_name}</h4>
              <p>SKU: {item.sku}</p>
              <p>${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                dispatch(updateCartItemQuantity({ itemId: item.id, quantity: parseInt(e.target.value, 10) || 1 }))
              }
            />
            <p>${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            <button onClick={() => dispatch(removeCartItem(item.id))}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
        <Button onClick={() => navigate('/checkout')} fullWidth>Proceed to Checkout</Button>
      </div>
    </div>
  );
}

export default Cart;