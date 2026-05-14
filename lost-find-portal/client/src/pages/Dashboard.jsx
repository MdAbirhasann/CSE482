import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const { data } = await api.get('/items/user/mine');
        setItems(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMine();
  }, []);

  const stats = {
    total: items.length,
    lost: items.filter((item) => item.itemType === 'lost').length,
    found: items.filter((item) => item.itemType === 'found').length,
    closed: items.filter((item) => item.status === 'closed').length
  };

  return (
    <section className="container py-5">
      <div className="dashboard-header shadow-sm mb-4">
        <div>
          <span className="eyebrow">User Panel</span>
          <h1 className="fw-bold mt-2">Welcome, {user?.name}</h1>
          <p className="mb-0 text-muted">Manage your posts, check claims, and update item status.</p>
        </div>
        <Link className="btn btn-primary" to="/create">Create New Post</Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="stat-card"><strong>{stats.total}</strong><span>Total Posts</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.lost}</strong><span>Lost</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.found}</strong><span>Found</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.closed}</strong><span>Resolved</span></div></div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-4">Loading dashboard...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Create your first lost/found item post.</p>
        </div>
      ) : (
        <div className="table-responsive dashboard-table shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Claims</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td><span className={`badge ${item.itemType === 'lost' ? 'text-bg-danger' : 'text-bg-success'}`}>{item.itemType}</span></td>
                  <td>{item.category}</td>
                  <td>{item.status}</td>
                  <td>{item.claims?.length || 0}</td>
                  <td className="d-flex gap-2">
                    <Link className="btn btn-sm btn-outline-primary" to={`/items/${item._id}`}>View</Link>
                    <Link className="btn btn-sm btn-outline-warning" to={`/items/${item._id}/edit`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
