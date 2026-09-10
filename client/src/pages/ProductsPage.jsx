import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductsPage({ initialCategory = 'All', onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const categories = [
    'All',
    'Electronics',
    'Wearables',
    'Home & Living',
    'Apparel & Footwear',
    'Books & Stationery'
  ];

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (category && category !== 'All') {
      params.append('category', category);
    }
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (priceRange.min) {
      params.append('minPrice', priceRange.min);
    }
    if (priceRange.max) {
      params.append('maxPrice', priceRange.max);
    }
    if (sortBy && sortBy !== 'default') {
      params.append('sort', sortBy);
    }

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(err => console.error('Failed to fetch products:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('default');
    setTimeout(() => {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (data.success) setProducts(data.products);
        });
    }, 50);
  };

  return (
    <div className="page-container">
      {/* Page Title & Search Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Product Catalog</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
              Explore our wide range of premium electronics, lifestyle essentials, and apparel.
            </p>
          </div>

          {/* Quick count pill */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-alt)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }} id="products-count-badge">
            Showing <strong>{products.length}</strong> items
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', display: 'flex', gap: '0.5rem' }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
              <Search className="input-icon" size={18} />
              <input
                id="search-input"
                type="text"
                className="form-control"
                placeholder="Search products by title, feature, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setTimeout(fetchProducts, 10); }}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  id="clear-search-btn"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary" id="search-submit-btn">
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              id="sort-select"
              className="form-control"
              style={{ width: 'auto', minWidth: '170px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Alphabetical: A - Z</option>
              <option value="name-desc">Alphabetical: Z - A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <aside className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }} id="catalog-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Filter size={16} /> Filters
            </div>
            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              id="reset-filters-btn"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.65rem' }}>Categories</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setCategory(cat)}
                  id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: category === cat ? 'var(--color-primary-light)' : 'transparent',
                    color: category === cat ? 'var(--color-primary)' : 'var(--text-dark)',
                    fontWeight: category === cat ? 700 : 500,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <span>{cat}</span>
                  {category === cat && <span style={{ fontSize: '0.8rem' }}>●</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <form onSubmit={handleApplyPriceFilter} style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.65rem' }}>Price Range ($)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input
                id="filter-min-price"
                type="number"
                min="0"
                className="form-control form-control-sm"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
              <input
                id="filter-max-price"
                type="number"
                min="0"
                className="form-control form-control-sm"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-secondary btn-sm btn-full"
              id="apply-price-filter-btn"
            >
              Apply Filter
            </button>
          </form>
        </aside>

        {/* Product Grid Area */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Filtering catalog products...
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }} id="no-products-found">
              <Search size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                We couldn't find any products matching your active search keyword, category, or price range.
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleResetFilters}
                id="reset-no-results-btn"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid" id="product-grid-container">
              {products.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
