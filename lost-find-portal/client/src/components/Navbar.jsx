import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, clearNotifications } = useSocket();
  const navigate = useNavigate();
  const isManager = ['manager', 'admin'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top app-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold brand-gradient" to="/">
          Lost&Find Pro
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><NavLink className="nav-link" to="/items">Browse</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/how-it-works">How It Works</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/live-location">Live Location</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/api-payments">API & Payment</NavLink></li>
            {isAuthenticated && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/create">Post Item</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
                {isManager && <li className="nav-item"><NavLink className="nav-link" to="/manager">Manager</NavLink></li>}
              </>
            )}
            <li className="nav-item dropdown">
              <button className="btn btn-light position-relative dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Alerts
                {notifications.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">{notifications.length}</span>}
              </button>
              <div className="dropdown-menu dropdown-menu-end p-3 notification-menu">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Notifications</strong>
                  <button className="btn btn-sm btn-link" onClick={clearNotifications}>Clear</button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-muted small mb-0">No new real-time alerts.</p>
                ) : (
                  notifications.map((note) => (
                    <div className="notification-item" key={note.id}>
                      <span className="badge text-bg-primary mb-1">{note.type}</span>
                      <p className="small mb-0">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </li>
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  {user?.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text small text-muted">Role: {user?.role}</span></li>
                  <li><Link className="dropdown-item" to="/dashboard">My Dashboard</Link></li>
                  {isManager && <li><Link className="dropdown-item" to="/manager">Manager Panel</Link></li>}
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item"><NavLink className="btn btn-outline-primary" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="btn btn-primary" to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
