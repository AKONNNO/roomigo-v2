// PropertyDetails page — developed by Prince Korankye Akonno
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
  const { user, isAuthenticated, isStudent } = useAuth();
  const { createEnquiry } = useBooking();
  const { getProperty, addReview } = useProperty();
  const property = getProperty(id);
  const roomTypes = property?.roomTypes || [];
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', message: 'I am interested in booking a room.' });
  const activeRoomType = roomTypes.includes(selectedRoomType) ? selectedRoomType : (roomTypes[0] || null);

  // Room-type photos: when the manager uploaded photos for the selected room
  // configuration, the gallery shows those instead of the hostel's general
  // gallery. Falls back to property.images when there are no room photos.
  const roomPhotos = (activeRoomType != null && property?.roomImages && property.roomImages[activeRoomType]) || [];
  const displayImages = roomPhotos.length ? roomPhotos : (property?.images || []);

  // Student reviews & ratings
  const reviewsList = property?.reviewsList || [];
  const initialMine = reviewsList.find(r => r.userId === user?.id);
  const hasUserReviewed = !!initialMine;
  const [reviewRating, setReviewRating] = useState(initialMine ? initialMine.rating : 0);
  const [reviewText, setReviewText] = useState(initialMine ? initialMine.comment || '' : '');
  const [reviewNote, setReviewNote] = useState('');

  // Auto-advance the image gallery every 4 seconds
  useEffect(() => {
    if (displayImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % displayImages.length);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeRoomType, displayImages.length]);

  // Jump back to the first photo whenever the selection switches room types.
  useEffect(() => {
    setCurrentImage(0);
  }, [activeRoomType, id]);

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
      roomType: activeRoomType,
      amount: Number(activeRoomType ? priceFor(activeRoomType) : property.price) || 0,
      priceType: property.priceType
    });
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); }, 3000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isStudent || !user) {
      setReviewNote('Please sign in as a student to leave a review.');
      return;
    }
    if (!reviewRating) {
      setReviewNote('Please choose a star rating before submitting.');
      return;
    }
    addReview(property.id, {
      userId: user.id,
      userName: user.name || 'Student',
      rating: reviewRating,
      comment: reviewText.trim()
    });
    setReviewNote('Thank you! Your review has been added and the hostel rating updated.');
    setTimeout(() => setReviewNote(''), 5000);
  };

  // Price for a room type: use the explicit per-room-type price when
  // defined, otherwise fall back to the property's headline price.
  const priceFor = (rt) => (
    property.roomPrices && property.roomPrices[rt] != null
      ? property.roomPrices[rt]
      : property.price
  );

  // Whether the manager uploaded photos for this room configuration.
  const hasRoomPhotos = (rt) => !!(property.roomImages && property.roomImages[rt] && property.roomImages[rt].length);


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
          <img src={displayImages[currentImage] || displayImages[0]} alt={property.name} />
          {displayImages.length > 1 && (
            <>
              <button className="gallery-btn prev" onClick={() => setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)}><ChevronLeft size={30} /></button>
              <button className="gallery-btn next" onClick={() => setCurrentImage((prev) => (prev + 1) % displayImages.length)}><ChevronRight size={30} /></button>
            </>
          )}
          {roomPhotos.length > 0 && activeRoomType != null && (
            <div className="gallery-label"><Users size={15} /> {activeRoomType} in a Room photos</div>
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
                    <span>Room type</span><span>Price ({property.priceType.replace('per ', '')})</span><span>Availability</span>
                  </div>
                  {roomTypes.map(rt => (
                    <button
                      key={rt}
                      type="button"
                      className={`rooms-row rooms-item ${rt === activeRoomType ? 'selected' : ''}`}
                      onClick={() => setSelectedRoomType(rt)}
                    >
                      <span>
                        <Users size={16} /> {rt} in a room
                        {hasRoomPhotos(rt) && <em className="room-photo-chip">📷 photos</em>}
                      </span>
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

            <div className="reviews-section">
              <h2>Student Reviews &amp; Ratings</h2>
              <div className="reviews-summary">
                <div className="reviews-score">
                  <span className="reviews-score-value">{property.rating}</span>
                  <div className="reviews-stars">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={18} fill={n <= Math.round(property.rating) ? '#f1c40f' : '#dce4ec'} color={n <= Math.round(property.rating) ? '#f1c40f' : '#dce4ec'} />
                    ))}
                  </div>
                  <span className="reviews-total">based on {property.reviews} rating{property.reviews === 1 ? '' : 's'}</span>
                </div>

                {isStudent && user ? (
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h3>{hasUserReviewed ? 'Update your review' : 'Rate this hostel'}</h3>
                    <div className="review-star-input">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                          title={`${n} star${n > 1 ? 's' : ''}`}
                        >
                          <Star size={26} fill={n <= reviewRating ? '#f1c40f' : '#dce4ec'} color={n <= reviewRating ? '#f1c40f' : '#dce4ec'} />
                        </button>
                      ))}
                      <span>{reviewRating ? `${reviewRating}/5` : 'Tap a star to rate'}</span>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="Share your experience (optional)"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="review-form-actions">
                      <button type="submit" className="review-submit-btn">{hasUserReviewed ? 'Update Review' : 'Submit Review'}</button>
                    </div>
                    {reviewNote && <p className="review-note">{reviewNote}</p>}
                    <p className="review-once-hint">{hasUserReviewed ? 'You have already reviewed this hostel — submitting again updates your review and rating.' : 'You can submit one review per hostel (submitting again will update it).'}</p>
                  </form>
                ) : isAuthenticated ? (
                  <p className="review-gate">Only students can leave a review on this hostel.</p>
                ) : (
                  <p className="review-gate">Sign in as a student to rate and review this hostel. <Link to="/login">Sign in</Link></p>
                )}
              </div>

              <div className="reviews-list">
                {[...reviewsList].reverse().map(r => (
                  <div className="review-card" key={r.id || `${r.userId}-${r.createdAt}`}>
                    <div className="review-card-head">
                      <span className="review-author">{r.userName || 'Student'}</span>
                      <div className="reviews-stars">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} size={13} fill={n <= r.rating ? '#f1c40f' : '#dce4ec'} color={n <= r.rating ? '#f1c40f' : '#dce4ec'} />
                        ))}
                      </div>
                      <span className="review-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <p className="review-comment">{r.comment || 'No written comment.'}</p>
                  </div>
                ))}
                {reviewsList.length === 0 && (
                  <p className="review-empty">No student reviews yet — be the first to rate this hostel!</p>
                )}
              </div>
            </div>
          </div>
          <aside className="details-sidebar">
            <div className="booking-card">
              <div className="price-section"><span className="price">GHS {(activeRoomType ? priceFor(activeRoomType) : property.price).toLocaleString()}</span><span className="price-type">{property.priceType}{activeRoomType ? ` • ${activeRoomType} in a room` : ''}</span></div>
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
