import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Grid3X3, Grid2X2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [categoryFilter, setCategoryFilter] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();

  // Load URL queries (e.g. from search bar redirect or footer links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || '';
    
    setSearchQuery(search);
    setCategoryFilter(category);
  }, [location.search]);

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    let url = `${API_URL}/api/products?`;
    
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;
    if (skinTypeFilter) url += `skinType=${encodeURIComponent(skinTypeFilter)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Apply sorting
        let sorted = [...data];
        if (sortOrder === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating);
        }
        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [searchQuery, categoryFilter, skinTypeFilter, sortOrder]);

  const clearFilters = () => {
    setCategoryFilter('');
    setSkinTypeFilter('');
    setSortOrder('popular');
    setSearchQuery('');
  };

  return (
    <div style={pageStyle} className="container animate-fade-in">
      {/* Page Header */}
      <ScrollReveal direction="down">
        <div style={headerStyle}>
          <h1 style={titleStyle}>Botanical Soap Collection</h1>
          <p style={subStyle}>Discover our organic loofah and cold-pressed herbal bars for premium daily nourishment.</p>
        </div>
      </ScrollReveal>

      {/* Main Grid: Sidebar + Products */}
      <div style={shopGridStyle} className="shop-main-layout">
        {/* Sidebar Filters */}
        <ScrollReveal direction="left" duration={0.8} style={{ width: '100%' }}>
          <aside style={sidebarStyle} className="glass-panel shop-sidebar">
            <div style={filterHeader}>
              <SlidersHorizontal size={18} style={{ color: '#4A5D4E' }} />
              <h3 style={filterTitle}>Refine Collection</h3>
            </div>

            {/* Search Input */}
            <div style={filterGroup}>
              <h4 style={groupTitle}>Search Keywords</h4>
              <input
                type="text"
                placeholder="e.g. neem, rose, mint..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={inputSearch}
              />
            </div>

            {/* Category Filter */}
            <div style={filterGroup}>
              <h4 style={groupTitle}>Category</h4>
              <div style={optionsList}>
                <label style={optionLabel}>
                  <input
                    type="radio"
                    name="category"
                    checked={categoryFilter === ''}
                    onChange={() => setCategoryFilter('')}
                    style={radioInput}
                  />
                  All Categories
                </label>
                {['Face Care', 'Body Care', 'Foot Care'].map((cat) => (
                  <label key={cat} style={optionLabel}>
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === cat}
                      onChange={() => setCategoryFilter(cat)}
                      style={radioInput}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Skin Type Filter */}
            <div style={filterGroup}>
              <h4 style={groupTitle}>Skin Type</h4>
              <div style={optionsList}>
                <label style={optionLabel}>
                  <input
                    type="radio"
                    name="skinType"
                    checked={skinTypeFilter === ''}
                    onChange={() => setSkinTypeFilter('')}
                    style={radioInput}
                  />
                  Any Skin Type
                </label>
                {['Oily', 'Dry', 'Sensitive', 'Normal'].map((type) => (
                  <label key={type} style={optionLabel}>
                    <input
                      type="radio"
                      name="skinType"
                      checked={skinTypeFilter === type}
                      onChange={() => setSkinTypeFilter(type)}
                      style={radioInput}
                    />
                    {type} Skin
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(categoryFilter || skinTypeFilter || searchQuery || sortOrder !== 'popular') && (
              <button onClick={clearFilters} style={clearBtn}>
                Reset Filters
              </button>
            )}
          </aside>
        </ScrollReveal>

        {/* Product Listings Section */}
        <section style={productsAreaStyle} className="shop-products-section">
          {/* Controls Bar */}
          <ScrollReveal direction="up" duration={0.8}>
            <div style={controlsBarStyle} className="glass-panel shop-controls-bar">
              <span style={resultsCountStyle}>
                Showing <strong>{products.length}</strong> natural soaps
              </span>

              <div style={sortingStyle}>
                <label style={{ fontSize: '13px', color: '#5E5A57', fontWeight: '700' }}>Sort By</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={selectSort}
                >
                  <option value="popular">Bestsellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          {/* Products Grid */}
          {loading ? (
            <div style={loaderStyle}>Gathering fresh botanicals...</div>
          ) : products.length === 0 ? (
            <div style={emptyStyle} className="glass-panel">
              <h3>No soaps match your filters</h3>
              <p>Try clearing some criteria or typing a different search keyword.</p>
              <button onClick={clearFilters} style={btnPrimary}>Reset All Filters</button>
            </div>
          ) : (
            <div style={gridStyle} className="shop-products-grid">
              {products.map((product, idx) => (
                <ScrollReveal key={product._id} direction="up" delay={(idx % 3) * 0.12}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// CSS in JS Shop styling
const pageStyle = {
  paddingTop: '40px',
  fontFamily: "'Inter', sans-serif",
};

const headerStyle = {
  marginBottom: '40px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '44px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '10px',
};

const subStyle = {
  fontSize: '16px',
  color: '#5E5A57',
  maxWidth: '650px',
  margin: '0 auto',
};

const shopGridStyle = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: '30px',
};

const sidebarStyle = {
  padding: '28px 24px',
  alignSelf: 'start',
  backgroundColor: '#FFFDF9',
};

const filterHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  paddingBottom: '16px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  marginBottom: '20px',
};

const filterTitle = {
  fontSize: '18px',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '700',
  color: '#1C1A19',
};

const filterGroup = {
  marginBottom: '24px',
};

const groupTitle = {
  fontSize: '13px',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: '#A06E52',
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const inputSearch = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
};

const optionsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const optionLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  color: '#5E5A57',
  fontWeight: '500',
  cursor: 'pointer',
};

const radioInput = {
  accentColor: '#4A5D4E',
  cursor: 'pointer',
};

const clearBtn = {
  width: '100%',
  backgroundColor: 'transparent',
  color: '#b23b3b',
  border: '1px solid rgba(178, 59, 59, 0.2)',
  padding: '10px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#FFF0F0',
  }
};

const productsAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const controlsBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#FFFDF9',
};

const resultsCountStyle = {
  fontSize: '14px',
  color: '#5E5A57',
};

const sortingStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const selectSort = {
  padding: '8px 14px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '13px',
  fontWeight: '600',
  color: '#1C1A19',
  backgroundColor: '#FFF',
  fontFamily: "'Inter', sans-serif",
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
};

const loaderStyle = {
  textAlign: 'center',
  padding: '80px 0',
  fontSize: '16px',
  color: '#5E5A57',
};

const emptyStyle = {
  textAlign: 'center',
  padding: '60px 40px',
  backgroundColor: '#FFFDF9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
};

const btnPrimary = {
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '12px 24px',
  borderRadius: '10px',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  marginTop: '10px',
};

export default Shop;
