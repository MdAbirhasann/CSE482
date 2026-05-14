import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [claim, setClaim] = useState({ message: '', contact: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isOwner = useMemo(() => item?.owner?._id === user?.id || item?.owner?.id === user?.id, [item, user]);

  const mapQuery = useMemo(() => {
    if (!item) return '';
    if (item.geo?.lat && item.geo?.lng) return `${item.geo.lat},${item.geo.lng}`;
    return encodeURIComponent(`${item.locationText}, ${item.area}, ${item.city}`);
  }, [item]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/items/${id}`);
      setItem(data.item);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitClaim = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.post(`/items/${id}/claim`, claim);
      setItem(data.item);
      setClaim({ message: '', contact: '' });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const resolveItem = async () => {
    try {
      const { data } = await api.patch(`/items/${id}/resolve`);
      setItem(data.item);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async () => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await api.delete(`/items/${id}`);
      navigate('/items');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container py-5 text-center">Loading item...</div>;
  if (error && !item) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <section className="container py-5">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="detail-card shadow-sm">
            {item.imageUrl && <img src={item.imageUrl} className="detail-img" alt={item.title} />}
            <div className="p-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className={`badge ${item.itemType === 'lost' ? 'text-bg-danger' : 'text-bg-success'}`}>{item.itemType}</span>
                <span className="badge text-bg-light border">{item.category}</span>
                <span className="badge text-bg-info">{item.status}</span>
              </div>
              <h1 className="fw-bold">{item.title}</h1>
              <p className="text-muted">Posted by {item.owner?.name} • {new Date(item.createdAt).toLocaleString()}</p>
              <p className="lead">{item.description}</p>
              <div className="info-grid my-4">
                <div><strong>City</strong><span>{item.city}</span></div>
                <div><strong>Area</strong><span>{item.area}</span></div>
                <div><strong>Date</strong><span>{new Date(item.dateHappened).toLocaleDateString()}</span></div>
                <div><strong>Reward</strong><span>{item.reward > 0 ? `৳${item.reward}` : 'No reward'}</span></div>
              </div>
              <p><strong>Exact location:</strong> {item.locationText}</p>
              <p><strong>Contact:</strong> {item.contactPhone}</p>
              {item.geo?.lat && item.geo?.lng && (
                <p className="small text-muted"><strong>GPS:</strong> {item.geo.lat}, {item.geo.lng}</p>
              )}

              <div className="d-flex flex-wrap gap-2 mt-4">
                <a className="btn btn-outline-primary" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
                {isOwner && (
                  <>
                    <Link className="btn btn-warning" to={`/items/${item._id}/edit`}>Edit</Link>
                    <button className="btn btn-success" onClick={resolveItem}>Mark Resolved</button>
                    <button className="btn btn-danger" onClick={deleteItem}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="side-panel shadow-sm mb-4">
            <h3 className="h5 fw-bold">Location Preview</h3>
            <div className="ratio ratio-4x3 map-frame">
              <iframe
                title="Google Map"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {!isOwner && (
            <div className="side-panel shadow-sm">
              <h3 className="h5 fw-bold">Claim / Contact Owner</h3>
              <p className="text-muted small">Explain how you can verify ownership or how you found the item.</p>
              <form onSubmit={submitClaim}>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="4" value={claim.message} onChange={(e) => setClaim({ ...claim, message: e.target.value })} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Contact</label>
                  <input className="form-control" value={claim.contact} onChange={(e) => setClaim({ ...claim, contact: e.target.value })} placeholder="Phone or email" required />
                </div>
                <button className="btn btn-primary w-100">Submit Claim</button>
              </form>
            </div>
          )}

          {isOwner && item.claims?.length > 0 && (
            <div className="side-panel shadow-sm mt-4">
              <h3 className="h5 fw-bold">Claim Requests</h3>
              {item.claims.map((claimRequest) => (
                <div className="claim-box" key={claimRequest._id}>
                  <strong>{claimRequest.user?.name}</strong>
                  <p className="small mb-1">{claimRequest.message}</p>
                  <span className="small text-muted">Contact: {claimRequest.contact}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ItemDetails;
