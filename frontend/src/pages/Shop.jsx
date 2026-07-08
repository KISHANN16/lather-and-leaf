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
                {(() => {
                  const isAllCatSelected = categoryFilter === '';
                  return (
                    <div
                      onClick={() => setCategoryFilter('')}
                      style={{
                        ...filterOptionRow,
                        backgroundColor: isAllCatSelected ? 'rgba(74, 93, 78, 0.08)' : 'transparent',
                        borderColor: isAllCatSelected ? '#4A5D4E' : 'rgba(74, 93, 78, 0.1)',
                      }}
                      className="filter-option"
                    >
                      <span style={{ 
                        ...optionText, 
                        color: isAllCatSelected ? '#4A5D4E' : '#5E5A57',
                        fontWeight: isAllCatSelected ? '700' : '500'
                      }}>
                        All Categories
                      </span>
                      <div style={{
                        ...customCheckCircle,
                        borderColor: isAllCatSelected ? '#4A5D4E' : 'rgba(74, 93, 78, 0.3)',
                        backgroundColor: isAllCatSelected ? '#4A5D4E' : 'transparent',
                      }}>
                        {isAllCatSelected && <div style={customCheckInner} />}
                      </div>
                    </div>
                  );
                })()}
                {['Face Care', 'Body Care', 'Foot Care'].map((cat) => {
                  const isSelected = categoryFilter === cat;
                  return (
                    <div
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      style={{
                        ...filterOptionRow,
                        backgroundColor: isSelected ? 'rgba(74, 93, 78, 0.08)' : 'transparent',
                        borderColor: isSelected ? '#4A5D4E' : 'rgba(74, 93, 78, 0.1)',
                      }}
                      className="filter-option"
                    >
                      <span style={{ 
                        ...optionText, 
                        color: isSelected ? '#4A5D4E' : '#5E5A57',
                        fontWeight: isSelected ? '700' : '500'
                      }}>
                        {cat}
                      </span>
                      <div style={{
                        ...customCheckCircle,
                        borderColor: isSelected ? '#4A5D4E' : 'rgba(74, 93, 78, 0.3)',
                        backgroundColor: isSelected ? '#4A5D4E' : 'transparent',
                      }}>
                        {isSelected && <div style={customCheckInner} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skin Type Filter */}
            <div style={filterGroup}>
              <h4 style={groupTitle}>Skin Type</h4>
              <div style={optionsGrid}>
                <button
                  onClick={() => setSkinTypeFilter('')}
                  style={{
                    ...pillStyle,
                    backgroundColor: skinTypeFilter === '' ? '#4A5D4E' : 'transparent',
                    color: skinTypeFilter === '' ? '#FFFDF9' : '#5E5A57',
                    borderColor: skinTypeFilter === '' ? '#4A5D4E' : 'rgba(74, 93, 78, 0.2)',
                  }}
                >
                  Any Skin Type
                </button>
                {['Oily', 'Dry', 'Sensitive', 'Normal'].map((type) => {
                  const isSelected = skinTypeFilter === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSkinTypeFilter(type)}
                      style={{
                        ...pillStyle,
                        backgroundColor: isSelected ? '#4A5D4E' : 'transparent',
                        color: isSelected ? '#FFFDF9' : '#5E5A57',
                        borderColor: isSelected ? '#4A5D4E' : 'rgba(74, 93, 78, 0.2)',
                      }}
                    >
                      {type} Skin
                    </button>
                  );
                })}
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
  padding: '12px 16px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  backgroundColor: '#FFFDF9',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.02)',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const optionsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const filterOptionRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(74, 93, 78, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const optionText = {
  fontSize: '14px',
  color: '#5E5A57',
  transition: 'all 0.2s ease',
};

const customCheckCircle = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '1.5px solid rgba(74, 93, 78, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.2s ease',
};

const customCheckInner = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#FFFDF9',
};

const optionsGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '6px',
};

const pillStyle = {
  padding: '8px 14px',
  borderRadius: '20px',
  border: '1px solid rgba(74, 93, 78, 0.2)',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: "'Inter', sans-serif",
  backgroundColor: 'transparent',
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
