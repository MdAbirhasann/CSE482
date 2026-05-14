import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';

const categories = ['Documents', 'Electronics', 'Wallet', 'Bag', 'Keys', 'ID Card', 'Pet', 'Other'];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        const item = data.item;
        setForm({
          title: item.title,
          description: item.description,
          itemType: item.itemType,
          category: item.category,
          imageUrl: item.imageUrl || '',
          city: item.city,
          area: item.area,
          locationText: item.locationText,
          contactPhone: item.contactPhone,
          dateHappened: new Date(item.dateHappened).toISOString().split('T')[0],
          reward: item.reward || 0,
          status: item.status,
          geo: { lat: item.geo?.lat || '', lng: item.geo?.lng || '' }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const updateGeo = (event) => setForm({ ...form, geo: { ...form.geo, [event.target.name]: event.target.value } });

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const { data } = await api.put(`/items/${id}`, form);
      navigate(`/items/${data.item._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container py-5 text-center">Loading edit form...</div>;
  if (!form) return <div className="container py-5"><div className="alert alert-danger">{error || 'Item not found.'}</div></div>;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="form-card shadow-sm">
            <span className="eyebrow">Update Post</span>
            <h1 className="fw-bold mt-2">Edit Item</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label">Title</label>
                  <input className="form-control" name="title" value={form.title} onChange={update} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={update}>
                    <option value="open">Open</option>
                    <option value="matched">Matched</option>
                    <option value="closed">Closed</option>
                  </select>
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
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" name="dateHappened" value={form.dateHappened} onChange={update} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input className="form-control" name="city" value={form.city} onChange={update} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Area</label>
                  <input className="form-control" name="area" value={form.area} onChange={update} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Exact Location</label>
                  <input className="form-control" name="locationText" value={form.locationText} onChange={update} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Phone</label>
                  <input className="form-control" name="contactPhone" value={form.contactPhone} onChange={update} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Reward</label>
                  <input type="number" className="form-control" name="reward" value={form.reward} onChange={update} />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input className="form-control" name="imageUrl" value={form.imageUrl} onChange={update} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="5" name="description" value={form.description} onChange={update} required></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Latitude</label>
                  <input className="form-control" name="lat" value={form.geo.lat} onChange={updateGeo} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Longitude</label>
                  <input className="form-control" name="lng" value={form.geo.lng} onChange={updateGeo} />
                </div>
              </div>
              <button className="btn btn-primary mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditItem;
