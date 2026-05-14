import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

const categories = ['Documents', 'Electronics', 'Wallet', 'Bag', 'Keys', 'ID Card', 'Pet', 'Other'];

const initialForm = {
  title: '',
  description: '',
  itemType: 'lost',
  category: 'Other',
  imageUrl: '',
  city: '',
  area: '',
  locationText: '',
  contactPhone: '',
  dateHappened: new Date().toISOString().split('T')[0],
  reward: 0,
  geo: { lat: '', lng: '' }
};

const CreateItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateGeo = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, geo: { ...prev.geo, [name]: value } }));
  };

  const useCurrentLocation = () => {
    setLocationMessage('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          geo: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setLocationMessage(`GPS captured with around ${Math.round(position.coords.accuracy || 0)}m accuracy.`);
      },
      () => setError('Could not access current location. Please allow browser location permission.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMatches([]);

    try {
      const { data } = await api.post('/items', form);
      setMatches(data.possibleMatches || []);
      if (!data.possibleMatches?.length) navigate(`/items/${data.item._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="form-card shadow-sm">
            <span className="eyebrow">Create Post</span>
            <h1 className="fw-bold mt-2">Report a Lost or Found Item</h1>
            <p className="text-muted">Provide accurate details so the system can help users identify possible matches.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            {locationMessage && <div className="alert alert-success">{locationMessage}</div>}

            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label">Title</label>
                  <input className="form-control" name="title" value={form.title} onChange={update} required minLength="3" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Type</label>
                  <select className="form-select" name="itemType" value={form.itemType} onChange={update}>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={update}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <input className="form-control" name="city" value={form.city} onChange={update} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Area</label>
                  <input className="form-control" name="area" value={form.area} onChange={update} required />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Exact Location</label>
                  <input className="form-control" name="locationText" value={form.locationText} onChange={update} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Date Lost/Found</label>
                  <input type="date" className="form-control" name="dateHappened" value={form.dateHappened} onChange={update} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Phone</label>
                  <input className="form-control" name="contactPhone" value={form.contactPhone} onChange={update} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Reward Amount</label>
                  <input type="number" min="0" className="form-control" name="reward" value={form.reward} onChange={update} />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input className="form-control" name="imageUrl" value={form.imageUrl} onChange={update} placeholder="https://..." />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="5" name="description" value={form.description} onChange={update} required minLength="10"></textarea>
                </div>
                <div className="col-md-5">
                  <label className="form-label">Latitude</label>
                  <input className="form-control" name="lat" value={form.geo.lat} onChange={updateGeo} />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Longitude</label>
                  <input className="form-control" name="lng" value={form.geo.lng} onChange={updateGeo} />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={useCurrentLocation}>Use GPS</button>
                </div>
              </div>
              {form.geo.lat && form.geo.lng && (
                <div className="col-12">
                  <div className="ratio ratio-21x9 map-frame">
                    <iframe title="Selected location" src={`https://maps.google.com/maps?q=${form.geo.lat},${form.geo.lng}&output=embed`} loading="lazy"></iframe>
                  </div>
                </div>
              )}
              <button className="btn btn-primary mt-4" disabled={loading}>{loading ? 'Posting...' : 'Submit Post'}</button>
            </form>
          </div>

          {matches.length > 0 && (
            <div className="alert alert-info mt-4">
              <h2 className="h5">Possible matches found</h2>
              <p>The item was posted successfully. Review these similar opposite-type posts:</p>
              <div className="list-group">
                {matches.map((match) => (
                  <a className="list-group-item list-group-item-action" href={`/items/${match._id}`} key={match._id}>
                    {match.title} — {match.area}, {match.city}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreateItem;
