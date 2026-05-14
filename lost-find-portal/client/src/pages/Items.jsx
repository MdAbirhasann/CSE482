import { useEffect, useState } from 'react';
import api from '../api/api.js';
import ItemCard from '../components/ItemCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';

const Items = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '', itemType: '', category: '', status: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/items?${params.toString()}`);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (event) => {
    event.preventDefault();
    fetchItems();
  };

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-end mb-4">
        <div>
          <span className="eyebrow">Browse Listings</span>
          <h1 className="fw-bold mt-2">Lost & Found Items</h1>
          <p className="text-muted mb-0">Search by keyword, type, category, or city.</p>
        </div>
      </div>

      <SearchFilters filters={filters} setFilters={setFilters} onSubmit={submit} />

      {error && <div className="alert alert-danger mt-4">{error}</div>}
      {loading ? (
        <div className="text-center py-5">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state mt-4">
          <h3>No items found</h3>
          <p>Try a different search term or post a new lost/found item.</p>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          {items.map((item) => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Items;
