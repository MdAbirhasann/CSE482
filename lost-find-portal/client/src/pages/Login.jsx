import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const fillDemo = (type) => {
    if (type === 'manager') setForm({ email: 'manager@lostfind.com', password: 'manager123' });
    else setForm({ email: 'demo@student.com', password: 'password123' });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(form);
      navigate(['manager', 'admin'].includes(user?.role) ? '/manager' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card shadow-sm">
        <span className="eyebrow">Secure Access</span>
        <h1 className="h3 fw-bold mt-2">Login</h1>
        <p className="text-muted">Access your dashboard, manager panel, claims, and payment features.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex gap-2 mb-3">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => fillDemo('user')}>Demo User</button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => fillDemo('manager')}>Manager Demo</button>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={update} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={update} required />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="mt-3 mb-0 text-center">No account? <Link to="/register">Create one</Link></p>
      </div>
    </section>
  );
};

export default Login;
