import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

const ManagerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchOverview = async () => {
    setError('');
    try {
      const { data } = await api.get('/manager/overview');
      setOverview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const updateStatus = async (id, status) => {
    setError('');
    setMessage('');
    try {
      const { data } = await api.patch(`/manager/items/${id}/status`, { status });
      setMessage(data.message);
      fetchOverview();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Manager delete this item?')) return;
    setError('');
    setMessage('');
    try {
      const { data } = await api.delete(`/manager/items/${id}`);
      setMessage(data.message);
      fetchOverview();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container py-5 text-center">Loading manager panel...</div>;

  const stats = overview?.stats || {};
  const items = overview?.items || [];
  const users = overview?.users || [];
  const claims = overview?.claims || [];

  return (
    <section className="container py-5">
      <div className="dashboard-header shadow-sm mb-4 manager-header">
        <div>
          <span className="eyebrow">Manager Panel</span>
          <h1 className="fw-bold mt-2">Operational Control Center</h1>
          <p className="mb-0 text-muted">Monitor all users, posts, claims, item status, and system activity.</p>
        </div>
        <Link className="btn btn-primary" to="/create">Create Official Post</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="stat-card"><strong>{stats.users || 0}</strong><span>Users</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.totalItems || 0}</strong><span>Total Items</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.open || 0}</strong><span>Open</span></div></div>
        <div className="col-md-3"><div className="stat-card"><strong>{stats.claims || 0}</strong><span>Claims</span></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="dashboard-table shadow-sm">
            <div className="p-3 border-bottom bg-white"><h2 className="h5 fw-bold mb-0">All Item Reports</h2></div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr><th>Item</th><th>Type</th><th>Status</th><th>Claims</th><th>Manage</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td><Link to={`/items/${item._id}`}>{item.title}</Link><div className="small text-muted">{item.area}, {item.city} • Owner: {item.owner?.name}</div></td>
                      <td><span className={`badge ${item.itemType === 'lost' ? 'text-bg-danger' : 'text-bg-success'}`}>{item.itemType}</span></td>
                      <td><span className="badge text-bg-light border">{item.status}</span></td>
                      <td>{item.claims?.length || 0}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateStatus(item._id, 'open')}>Open</button>
                          <button className="btn btn-sm btn-outline-info" onClick={() => updateStatus(item._id, 'matched')}>Matched</button>
                          <button className="btn btn-sm btn-outline-success" onClick={() => updateStatus(item._id, 'closed')}>Closed</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="side-panel shadow-sm mb-4">
            <h2 className="h5 fw-bold">Registered Users</h2>
            <div className="list-group list-group-flush">
              {users.map((user) => (
                <div className="list-group-item px-0" key={user._id || user.id}>
                  <strong>{user.name}</strong>
                  <div className="small text-muted">{user.email} • {user.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="side-panel shadow-sm">
            <h2 className="h5 fw-bold">Recent Claims</h2>
            {claims.length === 0 ? <p className="text-muted small mb-0">No claims submitted yet.</p> : claims.slice(0, 8).map((claim) => (
              <div className="claim-box d-block mb-2" key={claim._id}>
                <strong>{claim.itemTitle}</strong>
                <p className="small mb-1">{claim.message}</p>
                <span className="small text-muted">Contact: {claim.contact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerDashboard;
