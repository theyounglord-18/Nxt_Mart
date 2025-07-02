import React, { useState, useEffect } from 'react';
import './index.css';

function Content() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productQuantities, setProductQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem('productQuantities')) || {};
  });

  useEffect(() => {
    localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
  }, [productQuantities]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://apis2.ccbp.in/nxt-mart/category-list-details');
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to sync cartItems in localStorage
  const syncCartItems = (product, quantity) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingIndex = cartItems.findIndex(item => item.id === product.id);

    if (quantity > 0) {
      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity = quantity;
      } else {
        cartItems.push({ ...product, quantity });
      }
    } else {
      cartItems = cartItems.filter(item => item.id !== product.id);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const handleIncrement = (product) => {
    setProductQuantities((prev) => {
      const newQty = (prev[product.id] || 0) + 1;
      syncCartItems(product, newQty);
      return { ...prev, [product.id]: newQty };
    });
  };

  const handleDecrement = (product) => {
    setProductQuantities((prev) => {
      const newQty = (prev[product.id] || 0) - 1;
      syncCartItems(product, newQty);
      if (newQty <= 0) {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.id]: newQty };
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAllClick = () => {
    setSelectedCategory(null);
  };

  // Listen for changes in localStorage from Cart page
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'productQuantities') {
        const updatedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
        setProductQuantities(updatedQuantities);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Poll for changes in same tab
    const interval = setInterval(() => {
      const updatedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
      setProductQuantities(updatedQuantities);
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return <div style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'white', height:'100%', width:'100%', color:'black'}}>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  let productsToDisplay = [];
  if (selectedCategory) {
    productsToDisplay = selectedCategory.products;
  } else {
    productsToDisplay = categories.flatMap((cat) =>
      cat.products.map((product) => ({
        ...product,
        categoryName: cat.name,
      }))
    );
  }

  return (
    <div className="content-layout">
      <aside className="sidebar">
        <button
          className={`category-btn${selectedCategory === null ? ' active' : ''}`}
          onClick={handleAllClick}
        >
          All 
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-btn${selectedCategory && selectedCategory.name === category.name ? ' active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </aside>
      <main className="products-section">
        <h2 style={{color:'black', marginLeft:'10px'}}>
          {selectedCategory ? selectedCategory.name : 'All Products'}
        </h2>
        <ul className="product-list">
          {productsToDisplay.map((product) => (
            <li key={product.id} className="product-item">
              <img src={product.image} alt={product.name} className="img" />
              <div className="product-details">
                <div className="info">
                  <p className="pname">{product.name}</p>
                  <p className="pweight">{product.weight}</p>
                  <p className="pro-price">{product.price}</p>
                  {!selectedCategory && (
                    <p className="category-label">{product.categoryName}</p>
                  )}
                </div>
                <div>
                  {productQuantities[product.id] ? (
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="add-button-card"
                        onClick={() => handleDecrement(product)}
                      >
                        -
                      </button>
                      <span className="quantity" style={{color:'black'}}>
                        {productQuantities[product.id]}
                      </span>
                      <button
                        type="button"
                        className="add-button-card"
                        onClick={() => handleIncrement(product)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id="add-button-card"
                      className="add-btn"
                      onClick={() => handleIncrement(product)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Content;