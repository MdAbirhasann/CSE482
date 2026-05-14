import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <section className="container py-5">
      <div className="section-heading mb-4">
        <span className="eyebrow">2–3 Page Index Section</span>
        <h1 className="fw-bold mt-2">How Lost&Find Pro Works</h1>
        <p className="text-muted">This page presents the project flow in a professional, presentation-ready format.</p>
      </div>

      <div className="timeline-grid">
        <div className="process-card"><span>Step 1</span><h3>Register / Login</h3><p>Users create an account using email, phone, and password. JWT keeps protected pages secure.</p></div>
        <div className="process-card"><span>Step 2</span><h3>Post Item</h3><p>Lost or found posts include category, details, image URL, date, contact, reward, and live GPS coordinates.</p></div>
        <div className="process-card"><span>Step 3</span><h3>Search & Match</h3><p>Users browse listings with keyword, category, type, city, and status filtering. The API suggests possible matches.</p></div>
        <div className="process-card"><span>Step 4</span><h3>Claim & Verify</h3><p>Claimants submit a message and contact. Owners can verify identity before returning the item.</p></div>
        <div className="process-card"><span>Step 5</span><h3>Manager Review</h3><p>The manager panel monitors all users, posts, claims, and item status for administrative control.</p></div>
        <div className="process-card"><span>Step 6</span><h3>Reward Payment</h3><p>The sandbox API demonstrates bKash/Nagad-style payment initialization for reward transfer use cases.</p></div>
      </div>

      <div className="cta-panel mt-5">
        <div><h2 className="h4 fw-bold">Ready to test the system?</h2><p className="text-muted mb-0">Use the demo accounts from README or create your own account.</p></div>
        <Link to="/register" className="btn btn-primary">Create Account</Link>
      </div>
    </section>
  );
};

export default HowItWorks;
