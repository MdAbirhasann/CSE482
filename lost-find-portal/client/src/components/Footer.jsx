import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-top bg-white py-4 mt-5">
      <div className="container">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <p className="mb-1 fw-bold">Lost&Find Pro</p>
            <p className="mb-0 text-muted small">© {new Date().getFullYear()} Full-stack lost and found management system.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link className="footer-link" to="/how-it-works">Workflow</Link>
            <Link className="footer-link" to="/live-location">Live Location</Link>
            <Link className="footer-link" to="/api-payments">API & Payments</Link>
            <span className="text-muted small ms-md-3 d-block d-md-inline mt-2 mt-md-0">React • Express • MongoDB/Demo Store • Socket.io</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
