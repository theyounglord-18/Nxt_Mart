import React, { useEffect, useState } from 'react';
import Header from '../Header';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Read cart from localStorage
  const readCart = () => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  };

  // Helper to sync productQuantities in localStorage
  const syncProductQuantities = (productId, quantity) => {
    let productQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
    if (quantity > 0) {
      productQuantities[productId] = quantity;
    } else {
      delete productQuantities[productId];
    }
    localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
  };

  // Increment quantity in cart
  const handleIncrement = (item) => {
    const updatedCartItems = cartItems.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    syncProductQuantities(item.id, (item.quantity || 0) + 1);
  };

  // Decrement quantity in cart
  const handleDecrement = (item) => {
    let updatedCartItems = cartItems
      .map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter(cartItem => cartItem.quantity > 0);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    syncProductQuantities(item.id, (item.quantity || 0) - 1);
  };

  useEffect(() => {
    readCart(); // Initial read

    // Listen for changes in localStorage (from other tabs or components)
    const handleStorage = (event) => {
      if (event.key === 'cartItems') {
        readCart();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Poll for changes in same tab
    const interval = setInterval(readCart, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);
    const totalPrice = cartItems.reduce((sum, item) => {
      // If price is a string like "₹100", extract the number
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : item.price;
      return sum + priceNum * item.quantity;
    }, 0);
  return (
    <>
      <div className='cart-container'>
        <Header />
          <div className="cart" style={{padding: '20px', background: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'  }}>
            <h2>Items</h2>
            {cartItems.length === 0 ? (
            <div
              style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0'
            }}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                alt="empty cart"
                style={{ width: 180, marginBottom: 24 }}
              />
              <h2 style={{ color: '#007bff', marginBottom: 8 }}>Your cart is empty!</h2>
              <p style={{ color: '#555', marginBottom: 20, fontSize: '1.1rem' }}>
                Looks like you haven&apos;t added anything yet.
              </p>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 28px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
              <>
                <ul style={{listStyleType: 'none', padding: '20px 60px 60px', border: '1px solid #ccc', borderRadius: '12px', width: '60vw'}}>
                  {cartItems.map(item => (
                    <li key={item.id} className='cart-items' style={{display: 'flex', alignItems: 'center',justifyContent:'space-around' , gap: '20px', marginBottom: '20px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' , borderRadius: '12px'}} />
                          <div>
                            <p> {item.name}</p>
                            <p style={{color:'gray'}}>{item.weight}</p>
                            <p>{item.price}</p>
                          </div>
                      </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <button onClick={() => handleDecrement(item)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleIncrement(item)}>+</button>
                      </div>
                    </li>
                    
                  ))}
                </ul>
                <div style={{
              marginTop: '24px',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#222',
              background: '#fff',
              padding: '16px 32px',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
            }}>
              Total Price: ₹{totalPrice.toFixed(2)}
            </div>
              <button
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  alert('Order placed successfully!');
                  localStorage.removeItem('cartItems');
                  localStorage.removeItem('productQuantities');

                  readCart();
                  navigate('/payment');
                }}
              >
                Place Order
              </button>
            </>
          )}

          </div>
      </div>
    </>
  );
}

export default Cart;