import { Link } from 'react-router-dom';
import { MapPin, Wifi, Shield, Star, Check } from 'lucide-react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-image">
        <img src={property.images[0]} alt={property.name} />
        <div className="property-badges">
          {property.verified && (
            <span className="badge verified">
              <Check size={12} /> Verified
            </span>
          )}
          {property.availableRooms <= 3 && (
            <span className="badge urgent">Only {property.availableRooms} left</span>
          )}
        </div>
        <span className="property-gender">{property.gender}</span>
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3 className="property-name">{property.name}</h3>
          <div className="property-rating">
            <Star size={14} fill="#f1c40f" color="#f1c40f" />
            <span>{property.rating}</span>
            <span className="review-count">({property.reviews})</span>
          </div>
        </div>
        
        <p className="property-location">
          <MapPin size={14} /> {property.address}
        </p>
        
        <p className="property-distance">{property.distance} from campus</p>

        {(property.roomTypes || []).length > 0 && (
          <div className="property-roomtypes">
            <span className="roomtypes-label">Rooms:</span>
            {property.roomTypes.map(rt => (
              <span key={rt} className="roomtype-tag">
                {rt} in a Room
                {property.roomPrices && property.roomPrices[rt] != null && (
                  <>
                    <br />
                    <em className="roomtype-price">GHS {Number(property.roomPrices[rt]).toLocaleString()}</em>
                  </>
                )}
              </span>
            ))}
          </div>
        )}
        
        <div className="property-amenities">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity === 'WiFi' && <Wifi size={12} />}
              {amenity === '24/7 Security' && <Shield size={12} />}
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="amenity-more">+{property.amenities.length - 3} more</span>
          )}
        </div>
        
        <div className="property-footer">
          <div className="property-price">
            <span className="price-value">GHS {property.price.toLocaleString()}</span>
            <span className="price-type">{property.priceType}</span>
          </div>
          <button className="view-btn">View Details</button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
