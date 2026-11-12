import { locations, priceRanges, genderOptions, amenityOptions, roomTypeOptions } from '../data/additionalProperties';
import './SearchFilters.css';

const SearchFilters = ({ filters, setFilters }) => {
  const handleLocationChange = (e) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handlePriceChange = (index) => {
    const range = priceRanges[index];
    setFilters({ ...filters, priceMin: range.min, priceMax: range.max });
  };

  const handleGenderChange = (gender) => {
    setFilters({ ...filters, gender });
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities });
  };

  const handleRoomTypeToggle = (value) => {
    const newRoomTypes = filters.roomTypes.includes(value)
      ? filters.roomTypes.filter(v => v !== value)
      : [...filters.roomTypes, value];
    setFilters({ ...filters, roomTypes: newRoomTypes });
  };

  const clearFilters = () => {
    setFilters({
      location: 'All Locations',
      priceMin: 0,
      priceMax: Infinity,
      gender: 'All',
      amenities: [],
      roomTypes: [],
      search: ''
    });
  };

  return (
    <div className="search-filters">
      <div className="filter-section">
        <label>Location</label>
        <select value={filters.location} onChange={handleLocationChange}>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Price Range</label>
        <div className="price-buttons">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              className={`price-btn ${filters.priceMin === range.min ? 'active' : ''}`}
              onClick={() => handlePriceChange(index)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Gender</label>
        <div className="gender-buttons">
          {genderOptions.map(gender => (
            <button
              key={gender}
              className={`gender-btn ${filters.gender === gender ? 'active' : ''}`}
              onClick={() => handleGenderChange(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Amenities</label>
        <div className="amenity-checkboxes">
          {amenityOptions.map(amenity => (
            <label key={amenity} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Room Type</label>
        <div className="roomtype-checkboxes">
          {roomTypeOptions.map(option => (
            <label key={option.value} className="roomtype-checkbox">
              <input
                type="checkbox"
                checked={filters.roomTypes.includes(option.value)}
                onChange={() => handleRoomTypeToggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="clear-filters" onClick={clearFilters}>
        Clear All Filters
      </button>
    </div>
  );
};

export default SearchFilters;
