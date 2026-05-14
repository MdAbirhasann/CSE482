import { useEffect, useState } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ApiPayments = () => {
  const { isAuthenticated } = useAuth();
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ provider: 'bkash', amount: 100, itemId: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const { data } = await api.get('/payments/providers');
        setProviders(data.providers || []);
      } catch (err) {
        setError(err.message);
      }
    };
    loadProviders();
  }, []);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create', form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="section-heading mb-4">
        <span className="eyebrow">API Integration</span>
        <h1 className="fw-bold mt-2">bKash & Nagad Sandbox Payment Module</h1>
        <p className="text-muted">A professional API layer for reward payments. Real checkout requires official merchant credentials, but this sandbox flow is suitable for project demonstration.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="row g-3">
            {providers.map((provider) => (
              <div className="col-md-6" key={provider.id}>
                <div className="payment-card h-100">
                  <span className="badge text-bg-success">{provider.status}</span>
                  <h3 className="mt-3">{provider.name}</h3>
                  <p className="text-muted small">{provider.useCase}</p>
                  <code>POST /api/payments/create</code>
                </div>
              </div>
            ))}
          </div>

          <div className="api-doc-card mt-4">
            <h2 className="h4 fw-bold">Main API Endpoints</h2>
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr><td><code>POST /api/auth/register</code></td><td>Create user or manager account</td></tr>
                  <tr><td><code>POST /api/auth/login</code></td><td>JWT login</td></tr>
                  <tr><td><code>GET /api/items</code></td><td>Browse/search lost and found items</td></tr>
                  <tr><td><code>POST /api/items</code></td><td>Create a lost/found report with GPS</td></tr>
                  <tr><td><code>GET /api/manager/overview</code></td><td>Manager statistics, users, posts, claims</td></tr>
                  <tr><td><code>POST /api/payments/create</code></td><td>Initialize sandbox bKash/Nagad payment</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="form-card shadow-sm">
            <h2 className="h4 fw-bold">Test Sandbox Payment</h2>
            {!isAuthenticated && <div className="alert alert-warning">Login first to initialize a payment request.</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Provider</label>
                <select className="form-select" name="provider" value={form.provider} onChange={update}>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Amount (BDT)</label>
                <input className="form-control" type="number" min="1" name="amount" value={form.amount} onChange={update} />
              </div>
              <div className="mb-3">
                <label className="form-label">Item ID (optional)</label>
                <input className="form-control" name="itemId" value={form.itemId} onChange={update} placeholder="Connect payment to item" />
              </div>
              <button className="btn btn-primary w-100" disabled={!isAuthenticated || loading}>{loading ? 'Creating...' : 'Create Payment'}</button>
            </form>

            {result && (
              <div className="alert alert-success mt-4">
                <strong>{result.message}</strong>
                <p className="small mb-1">Transaction: {result.payment.transactionId}</p>
                <p className="small mb-2">Status: {result.payment.status}</p>
                <a className="btn btn-sm btn-outline-success" href={result.checkoutUrl} target="_blank" rel="noreferrer">Open Sandbox Checkout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiPayments;
