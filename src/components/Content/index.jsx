import React, { useState, useEffect } from 'react';
import './index.css';
import { FaSearch } from 'react-icons/fa'; // 👈 search icon

function Content() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productQuantities, setProductQuantities] = useState(() => {
    return JSON.parse(localStorage.getItem('productQuantities')) || {};
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState(''); // 👈 search state

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setProductsPerPage(isMobile ? 9 : 12);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleAllClick = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'productQuantities') {
        const updatedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
        setProductQuantities(updatedQuantities);
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => {
      const updatedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
      setProductQuantities(updatedQuantities);
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

  // 🔍 Filter by search query
  const filteredProducts = productsToDisplay.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <div className="content-layout">
      <aside className="sidebar">
        <button className={`category-btn${selectedCategory === null ? ' active' : ''}`} onClick={handleAllClick}>
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
        {/* Heading and Search Area */}
        <div className="search-header">
          <h2 style={{ color: 'black', marginLeft: '10px' }}>
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h2>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page when searching
              }}
            />
          </div>
        </div>

        <ul className="product-list">
          {paginatedProducts.map((product) => (
            <li key={product.id} className="product-item">
              <img src={product.image} alt={product.name} className="img" />
              <div className="product-details">
                <div className="info">
                  <p className="pname">{product.name}</p>
                  <p className="pweight">{product.weight}</p>
                  <p className="pro-price">{product.price}</p>
                  {!selectedCategory && <p className="category-label">{product.categoryName}</p>}
                </div>
                <div>
                  {productQuantities[product.id] ? (
                    <div className="quantity-controls">
                      <button className="add-button-card" onClick={() => handleDecrement(product)}>-</button>
                      <span className="quantity" style={{ color: 'black' }}>{productQuantities[product.id]}</span>
                      <button className="add-button-card" onClick={() => handleIncrement(product)}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => handleIncrement(product)}>Add</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
            >
              ←
            </button>
            <span className="pagination-info">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Content;
