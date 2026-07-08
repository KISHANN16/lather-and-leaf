import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, RefreshCw, Trash2, ArrowUpRight, DollarSign } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Admin = () => {
  const { user, token, logout } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [productSearch, setProductSearch] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  // Orders Pagination State
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPages, setOrdersPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Uploader State
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    category: 'Face Care',
    skinType: 'All Skin Types',
    fragrance: '',
    weight: '100g',
    stock: 10,
    price: '',
    oldPrice: '',
    badge: '',
    keywords: '',
    description: '',
    about: '',
    benefits: '',
    howToUse: '',
    image: '',
  });

  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Restrict access
    if (!token || !user || user.role !== 'admin') {
      alert('Access Denied. Admins only.');
      navigate('/');
      return;
    }

    fetchOrders(1);
    fetchFeedbacks();
    fetchProducts();
  }, [token, user, navigate]);

  const fetchOrders = (page = 1) => {
    setLoadingOrders(true);
    fetch(`${API_URL}/api/orders?pageNumber=${page}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          navigate('/login');
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setOrdersPage(data.page || 1);
        setOrdersPages(data.pages || 1);
        setTotalOrders(data.totalOrders || 0);
        setTotalRevenue(data.totalRevenue || 0);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingOrders(false);
      });
  };

  const fetchFeedbacks = () => {
    setLoadingFeedbacks(true);
    fetch(`${API_URL}/api/feedback`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoadingFeedbacks(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingFeedbacks(false);
      });
  };

  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProducts(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        showToast(`Order status updated to ${newStatus}`);
        fetchOrders(ordersPage);
      } else {
        showToast('Failed to update order status');
      }
    } catch (err) {
      console.error(err);
      showToast('Error syncing status update');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this customer feedback?')) return;

    try {
      const response = await fetch(`${API_URL}/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('Feedback review removed');
        fetchFeedbacks();
      } else {
        showToast('Failed to delete feedback');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearOrders = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete ALL orders? This cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/api/orders/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('All order history cleared');
        fetchOrders(1);
      } else {
        showToast('Failed to clear orders');
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleClearFeedbacks = async () => {
    if (!window.confirm('Are you sure you want to delete ALL customer feedbacks?')) return;

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('All feedbacks cleared');
        fetchFeedbacks();
      } else {
        showToast('Failed to clear feedbacks');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product CRUD Handlers
  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      shortName: '',
      category: 'Face Care',
      skinType: 'All Skin Types',
      fragrance: '',
      weight: '100g',
      stock: 10,
      price: '',
      oldPrice: '',
      badge: '',
      keywords: '',
      description: '',
      about: '',
      benefits: '',
      howToUse: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      shortName: product.shortName || '',
      category: product.category || 'Face Care',
      skinType: product.skinType || 'All Skin Types',
      fragrance: product.fragrance || '',
      weight: product.weight || '100g',
      stock: product.stock !== undefined ? product.stock : 10,
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      badge: product.badge || '',
      keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : '',
      description: product.description || '',
      about: product.about || '',
      benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : '',
      howToUse: Array.isArray(product.howToUse) ? product.howToUse.join('\n') : '',
      image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (response.ok) {
        showToast('Product deleted successfully');
        fetchProducts();
      } else {
        showToast(resData.message || 'Error deleting product');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.skinType) {
      showToast('Please fill out all required fields.');
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      stock: Number(formData.stock),
      keywords: formData.keywords ? formData.keywords.split(',').map(s => s.trim()).filter(Boolean) : [],
      benefits: formData.benefits ? formData.benefits.split('\n').map(s => s.trim()).filter(Boolean) : [],
      howToUse: formData.howToUse ? formData.howToUse.split('\n').map(s => s.trim()).filter(Boolean) : [],
      images: formData.image ? [formData.image.trim()] : [],
    };

    const url = editingProduct
      ? `${API_URL}/api/products/${editingProduct._id}`
      : `${API_URL}/api/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const resData = await response.json();

      if (response.ok) {
        showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast(resData.message || 'Error saving product');
      }
    } catch (err) {
      console.error(err);
      showToast('Server connection error');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);
    setUploading(true);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.image }));
        showToast('Image uploaded successfully!');
      } else {
        showToast(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
      showToast('Error uploading image');
    }
  };

  return (

    <div style={containerStyle} className="container animate-fade-in">
      {/* Top Banner */}
      <ScrollReveal direction="down" duration={0.8}>
        <div style={topBanner} className="glass-panel">
          <div>
            <h1 style={titleStyle}>Admin Dashboard</h1>
            <p style={subStyle}>Monitor order processing speeds, product catalog entries, customer feedback, and overall revenue estimations.</p>
          </div>
          <div style={bannerActions}>
            <button onClick={handleClearOrders} style={dangerBtn}>Clear All Orders</button>
            <button onClick={handleClearFeedbacks} style={dangerBtn}>Clear All Feedback</button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Board */}
      <div style={statsGrid} className="admin-stats-grid">
        <ScrollReveal direction="up" delay={0.0} duration={0.8}>
          <div style={statCard} className="glass-panel">
            <span style={statLabel}>Total Sales Revenue</span>
            <div style={statValRow}>
              <DollarSign size={24} style={{ color: '#4A5D4E' }} />
              <span style={statVal}>₹{totalRevenue}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15} duration={0.8}>
          <div style={statCard} className="glass-panel">
            <span style={statLabel}>Total Orders</span>
            <div style={statValRow}>
              <ShoppingBag size={24} style={{ color: '#A06E52' }} />
              <span style={statVal}>{totalOrders}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3} duration={0.8}>
          <div style={statCard} className="glass-panel">
            <span style={statLabel}>Customer Reviews</span>
            <div style={statValRow}>
              <Star size={24} style={{ color: '#F4B400' }} />
              <span style={statVal}>{feedbacks.length}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Navigation Tabs */}
      <div style={tabsRow}>
        <button
          onClick={() => setActiveTab('orders')}
          style={activeTab === 'orders' ? activeTabBtn : inactiveTabBtn}
        >
          Orders & Feedback
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={activeTab === 'products' ? activeTabBtn : inactiveTabBtn}
        >
          Product Inventory ({products.length})
        </button>
      </div>

      {/* Tab Contents: Orders & Feedbacks */}
      {activeTab === 'orders' && (
        <div style={splitGrid} className="admin-split-grid">
          {/* Orders Column */}
          <ScrollReveal direction="left" duration={0.8} style={{ width: '100%' }}>
            <div style={panelCard} className="glass-panel">
              <div style={panelHeader}>
                <h2 style={panelTitle}>Recent Orders ({orders.length})</h2>
                <button onClick={fetchOrders} style={refreshBtn} title="Reload Orders"><RefreshCw size={14} /></button>
              </div>

              <div style={panelBody}>
                {loadingOrders ? (
                  <div style={loaderStyle}>Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div style={emptyPanel}>No orders logged.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} style={orderRowCard}>
                      <div style={orderTitleRow}>
                        <strong>ID: {order.orderId}</strong>
                        <span style={priceTag}>₹{order.totalPrice}</span>
                      </div>
                      <div style={orderMetaText}>
                        <p style={{ marginBottom: '6px' }}>
                          <strong>Customer:</strong> {order.user?.name || order.shippingAddress?.fullName} ({order.user?.email || 'Guest'})
                        </p>
                        <p style={{ marginBottom: '6px' }}>
                          <strong>Items:</strong> {order.orderItems.map(item => `${item.quantity} × ${item.name}`).join(', ')}
                        </p>
                        
                        {/* Enhanced Address Box */}
                        <div style={shippingDetailsBlock}>
                          <p style={shippingDetailHeader}>📍 Shipping Address & Contact:</p>
                          <p style={{ margin: '2px 0' }}>{order.shippingAddress?.address1} {order.shippingAddress?.address2 ? `, ${order.shippingAddress.address2}` : ''}</p>
                          {order.shippingAddress?.street && <p style={{ margin: '2px 0' }}>Street: {order.shippingAddress.street}</p>}
                          <p style={{ margin: '2px 0' }}>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong>
                          </p>
                          <p style={{ marginTop: '6px', color: '#4A5D4E', fontWeight: '700' }}>
                            📞 Phone: {order.shippingAddress?.phone}
                          </p>
                          <p style={{ marginTop: '4px', fontSize: '11px', color: '#A09690' }}>
                            Payment Method: {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div style={statusSelectRow}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#5E5A57' }}>Modify Status:</label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={statusSelect}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
                {/* Pagination Controls */}
                {ordersPages > 1 && (
                  <div style={paginationRow}>
                    <button
                      disabled={ordersPage === 1}
                      onClick={() => {
                        const prev = Math.max(1, ordersPage - 1);
                        fetchOrders(prev);
                      }}
                      style={ordersPage === 1 ? disabledPageBtn : pageBtn}
                    >
                      Previous
                    </button>
                    <span style={pageIndicator}>
                      Page {ordersPage} of {ordersPages}
                    </span>
                    <button
                      disabled={ordersPage === ordersPages}
                      onClick={() => {
                        const next = Math.min(ordersPages, ordersPage + 1);
                        fetchOrders(next);
                      }}
                      style={ordersPage === ordersPages ? disabledPageBtn : pageBtn}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

            </div>
          </ScrollReveal>

          {/* Feedback Reviews Column */}
          <ScrollReveal direction="right" duration={0.8} style={{ width: '100%' }}>
            <div style={panelCard} className="glass-panel">
              <div style={panelHeader}>
                <h2 style={panelTitle}>Customer Feedback Panel ({feedbacks.length})</h2>
                <button onClick={fetchFeedbacks} style={refreshBtn} title="Reload Reviews"><RefreshCw size={14} /></button>
              </div>

              <div style={panelBody}>
                {loadingFeedbacks ? (
                  <div style={loaderStyle}>Loading reviews...</div>
                ) : feedbacks.length === 0 ? (
                  <div style={emptyPanel}>No feedback logged.</div>
                ) : (
                  feedbacks.map((item) => (
                    <div key={item._id} style={feedbackRowCard}>
                      <div style={feedbackTitleRow}>
                        <strong>{item.name} ({item.email})</strong>
                        <button onClick={() => handleDeleteFeedback(item._id)} style={trashBtn} title="Delete Review">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div style={starsRow}>
                        {Array.from({ length: item.rating }).map((_, i) => '★').join('')}
                        {Array.from({ length: 5 - item.rating }).map((_, i) => '☆').join('')}
                      </div>
                      <p style={feedbackMsg}>"{item.feedback}"</p>
                      <span style={feedbackDate}>
                        Submitted: {new Date(item.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Tab Contents: Product Inventory */}
      {activeTab === 'products' && (
        <ScrollReveal direction="up" duration={0.8} style={{ width: '100%' }}>
          <div style={panelCard} className="glass-panel">
            <div style={panelHeader}>
              <div>
                <h2 style={panelTitle}>Product Inventory Management</h2>
                <p style={{ fontSize: '13px', color: '#A09690', marginTop: '4px' }}>
                  Register, modify, or retire soap bars in your digital storefront.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={searchInput}
                />
                <button onClick={handleAddNewClick} style={successBtn}>
                  + Add Soap Product
                </button>
              </div>
            </div>

            <div style={productTableBody}>
              {loadingProducts ? (
                <div style={loaderStyle}>Loading products...</div>
              ) : products.length === 0 ? (
                <div style={emptyPanel}>No products registered in catalog.</div>
              ) : (
                <div style={productsTableContainer}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={tableHeaderRow}>
                        <th style={thStyle}>Product</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Skin Type / Fragrance</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter((p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product._id} style={tableRow}>
                            <td style={tdStyle}>
                              <div style={productInfoCell}>
                                <img
                                  src={product.images?.[0] || '/assets/default-soap.png'}
                                  alt={product.name}
                                  style={productThumb}
                                  onError={(e) => {
                                    e.target.src = 'https://placehold.co/100x100?text=Vegan+Soap';
                                  }}
                                />
                                <div>
                                  <div style={{ fontWeight: '700', color: '#1C1A19' }}>{product.name}</div>
                                  {product.badge && (
                                    <span style={badgeStyle}>{product.badge}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={tdStyle}>{product.category}</td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong>₹{product.price}</strong>
                                {product.oldPrice && (
                                  <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#A09690' }}>
                                    ₹{product.oldPrice}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <span style={product.stock <= 5 ? lowStockAlert : normalStock}>
                                {product.stock} units
                              </span>
                            </td>
                            <td style={tdStyle}>
                              <div style={{ fontSize: '12px', color: '#5E5A57' }}>
                                <p style={{ margin: '2px 0' }}><strong>Skin:</strong> {product.skinType}</p>
                                <p style={{ margin: '2px 0' }}><strong>Fragrance:</strong> {product.fragrance || 'N/A'}</p>
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleEditClick(product)}
                                  style={editBtn}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  style={deleteBtnStyle}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Product Form Modal */}
      {isModalOpen && (
        <div style={modalOverlay} className="animate-fade-in">
          <div style={modalContent} className="glass-panel animate-slide-up">
            <div style={modalHeader}>
              <h3 style={modalTitle}>{editingProduct ? 'Edit Product Catalog Details' : 'Add New Soap Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={closeModalBtn}>×</button>
            </div>

            <form onSubmit={handleFormSubmit} style={modalForm}>
              <div style={formGrid}>
                <div style={formGroup}>
                  <label style={labelStyle}>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Lavender Blossom Soap"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Short Tagline / Short Name</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Lavender Soap"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Face Care">Face Care</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Foot Care">Foot Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Gifts & Combos">Gifts & Combos</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Target Skin Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.skinType}
                    onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Dry / Sensitive Skin"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Fragrance Profile</label>
                  <input
                    type="text"
                    value={formData.fragrance}
                    onChange={(e) => setFormData({ ...formData, fragrance: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Lavender Herbaceous"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Weight / Quantity Desc</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. 100g"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={inputStyle}
                    placeholder="299"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Compare At Price (Old Price ₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    style={inputStyle}
                    placeholder="399"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Available Stock *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="number"
                      required
                      min="0"
                      disabled={Number(formData.stock) === 0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={Number(formData.stock) === 0 ? { ...inputStyle, backgroundColor: '#F0F0F0', color: '#A09690', cursor: 'not-allowed' } : inputStyle}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", color: '#5E5A57' }}>
                      <input
                        type="checkbox"
                        checked={Number(formData.stock) === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, stock: 0 });
                          } else {
                            setFormData({ ...formData, stock: 10 }); // Default to 10 on enable
                          }
                        }}
                      />
                      Mark as Out of Stock
                    </label>
                  </div>
                </div>


                <div style={formGroup}>
                  <label style={labelStyle}>Product Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. BESTSELLER • EXFOLIATOR"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Image Asset Path / Direct Upload *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. /assets/neem-soap.png"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadFileHandler}
                        style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif" }}
                      />
                      {uploading && <span style={{ fontSize: '12px', color: '#A06E52', fontWeight: 'bold' }}>Uploading...</span>}
                    </div>
                  </div>
                </div>


                <div style={formGroup}>
                  <label style={labelStyle}>Search Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    style={inputStyle}
                    placeholder="lavender, calming, organic"
                  />
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Brief Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={textareaStyle}
                  rows={2}
                  placeholder="Summary of the product shown in cards..."
                />
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Detailed About Section</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  style={textareaStyle}
                  rows={3}
                  placeholder="Full background, ingredients, and craft details..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Benefits (one per line)</label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    style={textareaStyle}
                    rows={4}
                    placeholder="Deep hydration&#10;Gentle natural loofah scrub"
                  />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>How to Use (one per line)</label>
                  <textarea
                    value={formData.howToUse}
                    onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                    style={textareaStyle}
                    rows={4}
                    placeholder="Wet the loofah soap bar&#10;Gently massage onto skin"
                  />
                </div>
              </div>

              <div style={modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtn}>
                  Cancel
                </button>
                <button type="submit" style={saveBtn}>
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS in JS Styling
const containerStyle = {
  paddingTop: '40px',
  fontFamily: "'Inter', sans-serif",
};

const topBanner = {
  padding: '34px',
  backgroundColor: '#F7ECE3',
  backgroundImage: 'linear-gradient(135deg, #F5ECE3 0%, #E6ECE7 100%)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  flexWrap: 'wrap',
  gap: '20px',
};

const titleStyle = {
  fontSize: '36px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '8px',
};

const subStyle = {
  fontSize: '15px',
  color: '#5E5A57',
};

const bannerActions = {
  display: 'flex',
  gap: '12px',
};

const dangerBtn = {
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  backgroundColor: '#b23b3b',
  color: '#FFFDF9',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(178, 59, 59, 0.15)',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginBottom: '34px',
};

const statCard = {
  padding: '24px',
  backgroundColor: '#FFFDF9',
};

const statLabel = {
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: '#A06E52',
  letterSpacing: '0.8px',
  marginBottom: '8px',
  display: 'block',
};

const statValRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const statVal = {
  fontSize: '34px',
  fontWeight: '850',
  color: '#1C1A19',
};

const splitGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px',
};

const panelCard = {
  backgroundColor: '#FFFDF9',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const panelHeader = {
  padding: '20px 24px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  backgroundColor: '#FDFCF7',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
};

const panelTitle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  fontWeight: '700',
};

const refreshBtn = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#4A5D4E',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const panelBody = {
  padding: '24px',
  maxHeight: '600px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const orderRowCard = {
  border: '1px solid rgba(74, 93, 78, 0.06)',
  borderRadius: '12px',
  padding: '16px',
  backgroundColor: '#FFF',
};

const orderTitleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};

const priceTag = {
  fontWeight: '800',
  color: '#4A5D4E',
};

const orderMetaText = {
  fontSize: '13px',
  color: '#5E5A57',
  lineHeight: '1.6',
  marginBottom: '12px',
};

const statusSelectRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderTop: '1px solid rgba(74, 93, 78, 0.05)',
  paddingTop: '10px',
};

const statusSelect = {
  flex: 1,
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  outline: 'none',
  fontSize: '13px',
  fontWeight: '600',
  color: '#1C1A19',
  fontFamily: "'Inter', sans-serif",
  cursor: 'pointer',
};

const feedbackRowCard = {
  border: '1px solid rgba(74, 93, 78, 0.06)',
  borderRadius: '12px',
  padding: '16px',
  backgroundColor: '#FFF',
};

const feedbackTitleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '6px',
};

const trashBtn = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#A09690',
  transition: 'color 0.2s',
  ':hover': {
    color: '#b23b3b',
  }
};

const starsRow = {
  color: '#F4B400',
  fontSize: '12px',
  marginBottom: '10px',
  letterSpacing: '1px',
};

const feedbackMsg = {
  fontStyle: 'italic',
  color: '#5E5A57',
  fontSize: '13.5px',
  lineHeight: '1.6',
  marginBottom: '8px',
};

const feedbackDate = {
  fontSize: '11px',
  color: '#A09690',
  fontWeight: '600',
};

const loaderStyle = {
  textAlign: 'center',
  padding: '40px 0',
  color: '#5E5A57',
};

const emptyPanel = {
  textAlign: 'center',
  padding: '40px 0',
  color: '#A09690',
};

// Tabs Styling
const tabsRow = {
  display: 'flex',
  gap: '12px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.1)',
  paddingBottom: '2px',
  marginBottom: '30px',
};

const tabBtnBase = {
  border: 'none',
  background: 'none',
  padding: '10px 20px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderRadius: '8px 8px 0 0',
  fontFamily: "'Inter', sans-serif",
};

const activeTabBtn = {
  ...tabBtnBase,
  color: '#4A5D4E',
  borderBottom: '3px solid #4A5D4E',
  backgroundColor: 'rgba(74, 93, 78, 0.05)',
};

const inactiveTabBtn = {
  ...tabBtnBase,
  color: '#A09690',
};

// Inventory Table styling
const searchInput = {
  padding: '8px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  width: '220px',
};

const successBtn = {
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(74, 93, 78, 0.15)',
};

const productTableBody = {
  padding: '0 24px 24px 24px',
};

const productsTableContainer = {
  overflowX: 'auto',
  marginTop: '10px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontFamily: "'Inter', sans-serif",
};

const tableHeaderRow = {
  borderBottom: '2px solid rgba(74, 93, 78, 0.1)',
};

const thStyle = {
  padding: '12px 16px',
  fontWeight: '700',
  fontSize: '13px',
  color: '#5E5A57',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tableRow = {
  borderBottom: '1px solid rgba(74, 93, 78, 0.05)',
  transition: 'background-color 0.2s',
};

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#1C1A19',
};

const productInfoCell = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const productThumb = {
  width: '45px',
  height: '45px',
  borderRadius: '8px',
  objectFit: 'cover',
  backgroundColor: '#F7ECE3',
  border: '1px solid rgba(74, 93, 78, 0.08)',
};

const badgeStyle = {
  display: 'inline-block',
  fontSize: '9px',
  fontWeight: '800',
  backgroundColor: '#F7ECE3',
  color: '#A06E52',
  padding: '2px 6px',
  borderRadius: '4px',
  marginTop: '4px',
  textTransform: 'uppercase',
};

const lowStockAlert = {
  color: '#b23b3b',
  fontWeight: '700',
  backgroundColor: 'rgba(178, 59, 59, 0.08)',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
};

const normalStock = {
  color: '#4A5D4E',
  fontWeight: '600',
  backgroundColor: 'rgba(74, 93, 78, 0.08)',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
};

const editBtn = {
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: '#E6ECE7',
  color: '#4A5D4E',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const deleteBtnStyle = {
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(178, 59, 59, 0.08)',
  color: '#b23b3b',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

// Modal styling
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(28, 26, 25, 0.6)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalContent = {
  backgroundColor: '#FFFDF9',
  width: '100%',
  maxWidth: '750px',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  overflowY: 'auto',
  border: '1px solid rgba(74, 93, 78, 0.1)',
};

const modalHeader = {
  padding: '20px 28px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FDFCF7',
};

const modalTitle = {
  fontSize: '22px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  fontWeight: '700',
};

const closeModalBtn = {
  border: 'none',
  background: 'none',
  fontSize: '28px',
  color: '#A09690',
  cursor: 'pointer',
  lineHeight: 1,
};

const modalForm = {
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#5E5A57',
};

const inputStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  backgroundColor: '#FFF',
};

const textareaStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  backgroundColor: '#FFF',
  resize: 'vertical',
};

const modalActions = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '10px',
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  paddingTop: '20px',
};

const cancelBtn = {
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  backgroundColor: '#E6ECE7',
  color: '#4A5D4E',
  fontWeight: '700',
  cursor: 'pointer',
};

const saveBtn = {
  border: 'none',
  padding: '10px 24px',
  borderRadius: '8px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(74, 93, 78, 0.15)',
};

// Shipping details box
const shippingDetailsBlock = {
  backgroundColor: '#FDFCF7',
  borderLeft: '3px solid #A06E52',
  padding: '12px 16px',
  borderRadius: '0 8px 8px 0',
  marginTop: '8px',
  fontSize: '12.5px',
  color: '#5E5A57',
  lineHeight: '1.5',
};

const shippingDetailHeader = {
  fontWeight: '700',
  color: '#A06E52',
  marginBottom: '4px',
};

export default Admin;
