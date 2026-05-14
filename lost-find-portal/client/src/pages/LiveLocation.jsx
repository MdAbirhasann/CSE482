import { useMemo, useState } from 'react';

const LiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mapQuery = useMemo(() => {
    if (!location) return 'Dhaka Bangladesh';
    return `${location.lat},${location.lng}`;
  }, [location]);

  const getLocation = () => {
    setError('');
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 0),
          capturedAt: new Date().toLocaleString()
        });
        setLoading(false);
      },
      () => {
        setError('Location permission denied or unavailable. Please allow location access in your browser.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const copyCoordinates = async () => {
    if (!location) return;
    await navigator.clipboard.writeText(`${location.lat}, ${location.lng}`);
  };

  return (
    <section className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-5">
          <div className="form-card shadow-sm">
            <span className="eyebrow">Live Location</span>
            <h1 className="fw-bold mt-2">Capture Current GPS Position</h1>
            <p className="text-muted">Use this feature when posting an item so the finder/owner can identify the exact lost or found location.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary btn-lg w-100" onClick={getLocation} disabled={loading}>{loading ? 'Detecting location...' : 'Use My Current Location'}</button>

            {location && (
              <div className="location-box mt-4">
                <div><strong>Latitude</strong><span>{location.lat}</span></div>
                <div><strong>Longitude</strong><span>{location.lng}</span></div>
                <div><strong>Accuracy</strong><span>{location.accuracy} meters</span></div>
                <div><strong>Captured</strong><span>{location.capturedAt}</span></div>
                <button className="btn btn-outline-primary mt-3" onClick={copyCoordinates}>Copy Coordinates</button>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="side-panel shadow-sm">
            <h2 className="h4 fw-bold">Map Preview</h2>
            <p className="text-muted small">The same map preview is used inside item details and can be opened in Google Maps.</p>
            <div className="ratio ratio-4x3 map-frame">
              <iframe title="Live GPS map" src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            {location && <a className="btn btn-outline-primary mt-3" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">Open in Google Maps</a>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveLocation;
