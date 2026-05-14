import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow">Smart Lost & Found Management System</span>
              <h1 className="display-4 fw-bold mt-3">Find lost items faster with live location, manager control, and secure reward support.</h1>
              <p className="lead text-muted mt-3">
                A professional full-stack portal for campuses, offices, malls, events, and communities to report lost/found items, verify claims, monitor activity, and support bKash/Nagad-style reward payments.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                <Link to="/items" className="btn btn-primary btn-lg">Browse Items</Link>
                <Link to="/create" className="btn btn-outline-primary btn-lg">Post Lost/Found Item</Link>
              </div>
              <div className="trusted-strip mt-4">
                <span>JWT Auth</span><span>Manager Panel</span><span>Live GPS</span><span>bKash/Nagad API Layer</span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-card shadow-lg">
                <div className="hero-card-header">
                  <span className="dot bg-danger"></span>
                  <span className="dot bg-warning"></span>
                  <span className="dot bg-success"></span>
                </div>
                <div className="p-4">
                  <div className="alert alert-success mb-3">Live match alert: Found ID Card near library</div>
                  <div className="mini-card mb-3">
                    <div>
                      <strong>Lost Wallet</strong>
                      <p className="mb-0 text-muted small">Dhanmondi • Wallet • Reward ৳500</p>
                    </div>
                    <span className="badge text-bg-danger">lost</span>
                  </div>
                  <div className="mini-card mb-3">
                    <div>
                      <strong>Found Laptop Bag</strong>
                      <p className="mb-0 text-muted small">Campus Gate • Bag • GPS Attached</p>
                    </div>
                    <span className="badge text-bg-success">found</span>
                  </div>
                  <div className="stats-grid mt-4">
                    <div><strong>24/7</strong><span>Posting</span></div>
                    <div><strong>GPS</strong><span>Location</span></div>
                    <div><strong>API</strong><span>Payments</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading text-center mb-4">
          <span className="eyebrow">Project Modules</span>
          <h2 className="fw-bold mt-3">Complete features for final submission</h2>
          <p className="text-muted">The homepage is arranged like a 3-section index: user service, manager operation, and payment/API integration.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card h-100">
              <div className="feature-icon">01</div>
              <h3>User Portal</h3>
              <p>Register, login, post lost/found items, add image, date, contact, reward, and GPS coordinates, then submit claims securely.</p>
              <Link to="/how-it-works" className="btn btn-sm btn-outline-primary">View workflow</Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card h-100">
              <div className="feature-icon">02</div>
              <h3>Manager Control</h3>
              <p>Manager users can review all posts, monitor claims, change status, resolve items, and remove wrong or duplicate reports.</p>
              <Link to="/manager" className="btn btn-sm btn-outline-primary">Open manager panel</Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card h-100">
              <div className="feature-icon">03</div>
              <h3>API & Payment Layer</h3>
              <p>Includes a clean API page and sandbox-ready bKash/Nagad payment initialization flow for reward or service fee use cases.</p>
              <Link to="/api-payments" className="btn btn-sm btn-outline-primary">View API module</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="cta-panel shadow-sm">
          <div>
            <span className="eyebrow">Professional Add-on</span>
            <h2 className="fw-bold mt-2">Live location makes every report more useful.</h2>
            <p className="text-muted mb-0">Users can capture current GPS coordinates and open the exact position in Google Maps.</p>
          </div>
          <Link className="btn btn-primary btn-lg" to="/live-location">Test Live Location</Link>
        </div>
      </section>
    </>
  );
};

export default Home;
