import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user', managerCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await register(form);
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
        <span className="eyebrow">Create Profile</span>
        <h1 className="h3 fw-bold mt-2">Register</h1>
        <p className="text-muted">Create a user account. For manager access, select Manager and use the project code.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" value={form.name} onChange={update} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={update} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" name="phone" value={form.phone} onChange={update} placeholder="+880..." />
          </div>
          <div className="mb-3">
            <label className="form-label">Account Type</label>
            <select className="form-select" name="role" value={form.role} onChange={update}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {form.role === 'manager' && (
            <div className="mb-3">
              <label className="form-label">Manager Access Code</label>
              <input className="form-control" name="managerCode" value={form.managerCode} onChange={update} placeholder="Default: manager123" />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={update} minLength="6" required />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="mt-3 mb-0 text-center">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
};

export default Register;
