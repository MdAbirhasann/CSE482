import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="container py-5 text-center">
      <div className="empty-state">
        <h1>404</h1>
        <p>The page you requested was not found.</p>
        <Link className="btn btn-primary" to="/">Back to Home</Link>
      </div>
    </section>
  );
};

export default NotFound;
