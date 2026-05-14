import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

const ItemCard = ({ item }) => {
  const badgeClass = item.itemType === 'lost' ? 'text-bg-danger' : 'text-bg-success';
  const hasGps = item.geo?.lat && item.geo?.lng;

  return (
    <article className="card item-card h-100 border-0 shadow-sm">
      <img src={item.imageUrl || fallbackImage} className="card-img-top item-img" alt={item.title} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className={`badge ${badgeClass}`}>{item.itemType}</span>
          <span className="badge text-bg-light border">{item.category}</span>
        </div>
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text text-muted small flex-grow-1">{item.description.slice(0, 120)}{item.description.length > 120 ? '...' : ''}</p>
        <div className="small text-muted mb-3">
          <div><strong>Location:</strong> {item.area}, {item.city}</div>
          <div><strong>Status:</strong> {item.status} {hasGps && <span className="badge text-bg-info ms-1">GPS</span>}</div>
          {item.reward > 0 && <div><strong>Reward:</strong> ৳{item.reward}</div>}
        </div>
        <Link className="btn btn-outline-primary w-100" to={`/items/${item._id}`}>View Details</Link>
      </div>
    </article>
  );
};

export default ItemCard;
