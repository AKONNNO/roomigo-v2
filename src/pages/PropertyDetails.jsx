import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Shield, Check, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, Users, ChevronRight as BreadcrumbSep } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import { useProperty } from '../context/useProperty';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createEnquiry } = useBooking();
  const { propertiesList } = useProperty();
  const property = propertiesList.find(p => p.id === id);
  const roomTypes = property?.roomTypes || [];
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', message: 'I am interested in booking a room.' });
  const activeRoomType = roomTypes.includes(selectedRoomType) ? selectedRoomType : (roomTypes[0] || null);

  // Auto-advance the image gallery every 4 seconds
  useEffect(() => {
    if (!property || !property.images || property.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, property?.images?.length]);

  if (!property) {
    return <div className="not-found"><h2>Property Not Found</h2><button onClick={() => navigate('/search')}>Back to Search</button></div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createEnquiry({
      ...form,
      propertyId: property.id,
      propertyName: property.name,
      userId: user?.id || 'guest',
      roomType: activeRoomType
    });
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); }, 3000);
  };

  // Per-person price split across occupants of the room configuration
  const priceFor = (rt) => Math.round(property.price / rt);


  return (
    <div className="property-details">
      <div className="container">
        <div className="details-topbar">
          <button className="back-btn" onClick={() => navigate('/search')}><ArrowLeft size={20} /> Back to Search</button>
          <nav className="breadcrumb">
            <Link to="/">Home</Link> <BreadcrumbSep size={14} />
            <Link to="/search">Browse hostels</Link> <BreadcrumbSep size={14} />
            <span>{property.name}</span>
          </nav>
        </div>
        <div className="image-gallery">
          <img src={property.images[currentImage]} alt={property.name} />
          {property.images.length > 1 && (
            <>
              <button className="gallery-btn prev" onClick={() => setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)}><ChevronLeft size={30} /></button>
              <button className="gallery-btn next" onClick={() => setCurrentImage((prev) => (prev + 1) % property.images.length)}><ChevronRight size={30} /></button>
            </>
          )}
          {property.verified && <div className="verified-badge"><Check size={16} /> Verified</div>}
        </div>
        <div className="details-layout">
          <div className="details-main">
            <div className="property-header">
              <div><h1>{property.name}</h1><p className="property-address"><MapPin size={18} /> {property.address}</p></div>
              <div className="property-rating"><Star size={20} fill="#f1c40f" color="#f1c40f" /><span>{property.rating}</span><span className="review-count">({property.reviews})</span></div>
            </div>
            <div className="property-info">
              <span className="info-badge">{property.gender}</span>
              <span className="info-badge">{property.distance}</span>
              <span className="info-badge">{property.availableRooms} rooms</span>
            </div>
            <div className="rooms-prices-section">
              <h2>Rooms and prices</h2>
              {(roomTypes.length > 0 ? (
                <div className="rooms-table">
                  <div className="rooms-row rooms-head">
                    <span>Room type</span><span>Price / year</span><span>Availability</span>
                  </div>
                  {roomTypes.map(rt => (
                    <button
                      key={rt}
                      type="button"
                      className={`rooms-row rooms-item ${rt === activeRoomType ? 'selected' : ''}`}
                      onClick={() => setSelectedRoomType(rt)}
                    >
                      <span><Users size={16} /> {rt} in a room</span>
                      <span>GH₵ {priceFor(rt).toLocaleString()}</span>
                      <span className={property.availableRooms <= 5 ? 'low' : ''}>
                        {property.availableRooms > 0 ? `${property.availableRooms} rooms left` : 'Full'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-roomtypes">Room options not specified.</p>
              ))}
              {activeRoomType && (
                <p className="room-type-selection-note">
                  You've selected a <strong>{activeRoomType}-in-a-Room</strong> room. This will be included in your enquiry.
                </p>
              )}
            </div>
            <div className="property-description"><h2>About</h2><p>{property.description}</p></div>
            <div className="property-amenities"><h2>Amenities</h2>
              <div className="amenities-grid">
                {property.amenities.map((a, i) => <div key={i} className="amenity-item">{a === 'WiFi' ? <Wifi size={24} /> : <Shield size={24} />}<span>{a}</span></div>)}
              </div>
            </div>
          </div>
          <aside className="details-sidebar">
            <div className="booking-card">
              <div className="price-section"><span className="price">GHS {property.price.toLocaleString()}</span><span className="price-type">{property.priceType}</span></div>
              <div className="manager-info"><h3>Manager: {property.manager.name}</h3>
                <div className="contact-buttons">
                  <a href={`tel:${property.manager.phone}`} className="contact-btn phone"><Phone size={18} /> Call</a>
                  <a href={`mailto:${property.manager.email}`} className="contact-btn email"><Mail size={18} /> Email</a>
                </div>
              </div>
              <button className="enquiry-btn" onClick={() => isAuthenticated ? setShowForm(true) : navigate('/login')}>Send Enquiry</button>
            </div>
            {showForm && (
              <div className="enquiry-form">
                <h3>Send Enquiry</h3>
                {submitted ? <div className="success-message"><Check size={24} /><p>Enquiry sent!</p></div> : (
                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    <button type="submit" className="submit-btn">Submit</button>
                  </form>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
