// PropertyForm component — coded by Prince Korankye Akonno
import { useState } from 'react';
import { roomTypeOptions } from '../data/additionalProperties';
import ImageUploader from './ImageUploader';
import './PropertyForm.css';

const PropertyForm = ({ initialData = {}, onSubmit, onCancel, submitLabel = 'Save Property' }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    address: initialData.address || '',
    distance: initialData.distance || '',
    price: initialData.price || '',
    priceType: initialData.priceType || 'per semester',
    rooms: initialData.rooms || '',
    availableRooms: initialData.availableRooms || '',
    roomTypes: initialData.roomTypes ? [...initialData.roomTypes] : [],
    roomPrices: initialData.roomPrices ? { ...initialData.roomPrices } : {},
    roomImages: initialData.roomImages && typeof initialData.roomImages === 'object' ? { ...initialData.roomImages } : {},
    gender: initialData.gender || 'Mixed',
    amenities: initialData.amenities ? initialData.amenities.join(', ') : '',
    description: initialData.description || '',
    images: initialData.images ? [...initialData.images] : [],
    managerName: initialData.manager?.name || '',
    managerPhone: initialData.manager?.phone || '',
    managerEmail: initialData.manager?.email || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoomTypeToggle = (value) => {
    const into = !form.roomTypes.includes(value);
    const roomTypes = into ? [...form.roomTypes, value] : form.roomTypes.filter(v => v !== value);
    const roomPrices = { ...form.roomPrices };
    const roomImages = { ...form.roomImages };
    if (!into) delete roomPrices[value];
    // Initialise (but never delete) that room's photo slot so re-selecting it
    // keeps any photos a manager already uploaded.
    if (into && !roomImages[value]) roomImages[value] = [];
    setForm({ ...form, roomTypes, roomPrices, roomImages });
  };

  const handleRoomPriceChange = (value, price) => {
    setForm({ ...form, roomPrices: { ...form.roomPrices, [value]: price } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomPriceCount = form.roomTypes.filter(rt => Number(form.roomPrices[rt]) > 0).length;
    if (!form.name || !form.address) {
      alert('Please fill in the hostel name and address.');
      return;
    }
    if (!form.price && roomPriceCount === 0) {
      alert('Please set a price — either a starting price or a price for each room configuration.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Hostel Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Kumasi Heights Hostel" required />
        </div>
        <div className="form-field">
          <label>Address *</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. Kumasi, Ayigya" required />
        </div>
        <div className="form-field">
          <label>Distance from Campus</label>
          <input name="distance" value={form.distance} onChange={handleChange} placeholder="e.g. 1.5 km" />
        </div>
        <div className="form-field">
          <label>Starting Price (GHS) — shown if a room has no set price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 2500" />
        </div>
        <div className="form-field">
          <label>Price Type</label>
          <select name="priceType" value={form.priceType} onChange={handleChange}>
            <option value="per semester">per semester</option>
            <option value="per year">per year</option>
            <option value="per month">per month</option>
            <option value="per night">per night</option>
          </select>
        </div>
        <div className="form-field">
          <label>Total Rooms</label>
          <input name="rooms" type="number" value={form.rooms} onChange={handleChange} placeholder="e.g. 20" />
        </div>
        <div className="form-field">
          <label>Available Rooms (Inventory)</label>
          <input name="availableRooms" type="number" value={form.availableRooms} onChange={handleChange} placeholder="e.g. 5" />
        </div>
        <div className="form-field full">
          <label>Available Room Configurations</label>
          <div className="roomtype-form-options">
            {roomTypeOptions.map(opt => (
              <label key={opt.value} className="roomtype-form-option">
                <input
                  type="checkbox"
                  checked={form.roomTypes.includes(opt.value)}
                  onChange={() => handleRoomTypeToggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {form.roomTypes.length > 0 && (
            <>
              <div className="room-price-grid">
                {[...form.roomTypes].sort((a, b) => a - b).map(rt => (
                  <div key={rt} className="room-price-field">
                    <span className="roomtype-form-option room-price-tag">{rt} in a Room</span>
                    <input
                      name={`roomPrice-${rt}`}
                      type="number"
                      min="0"
                      placeholder="Price (GHS)"
                      value={form.roomPrices[rt] || ''}
                      onChange={(e) => handleRoomPriceChange(rt, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="room-photos-section">
                <h4 className="room-photos-title">Room Photos (optional)</h4>
                <p className="room-photos-hint">Upload a photo for each room configuration. When a student selects that room type, these photos are shown instead of the general gallery.</p>
                {[...form.roomTypes].sort((a, b) => a - b).map(rt => (
                  <div className="room-photo-field" key={`room-photo-${rt}`}>
                    <span className="room-photo-label"><strong>{rt} in a Room</strong> — {rt === 1 ? 'single' : rt === 2 ? 'shared' : 'shared'} room photos</span>
                    <ImageUploader
                      value={form.roomImages[rt] || []}
                      onChange={(images) => setForm({ ...form, roomImages: { ...form.roomImages, [rt]: images } })}
                      maxImages={6}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="form-field">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="Mixed">Mixed</option>
            <option value="Male Only">Male Only</option>
            <option value="Female Only">Female Only</option>
          </select>
        </div>
        <div className="form-field full">
          <label>Amenities (comma separated)</label>
          <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="WiFi, 24/7 Security, Kitchen, Laundry" />
        </div>
        <div className="form-field full">
          <label>Description</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Describe the hostel..." />
        </div>
        <div className="form-field full">
          <label>Photos</label>
          <ImageUploader
            value={form.images}
            onChange={(images) => setForm({ ...form, images })}
          />
        </div>
      </div>

      <h3 className="manager-fields-title">Manager / Owner Contact</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>Manager Name</label>
          <input name="managerName" value={form.managerName} onChange={handleChange} placeholder="e.g. Mr. Kwame Asare" />
        </div>
        <div className="form-field">
          <label>Manager Phone</label>
          <input name="managerPhone" value={form.managerPhone} onChange={handleChange} placeholder="+233 ..." />
        </div>
        <div className="form-field">
          <label>Manager Email</label>
          <input name="managerEmail" value={form.managerEmail} onChange={handleChange} placeholder="manager@hostel.com" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit-btn">{submitLabel}</button>
        {onCancel && <button type="button" className="form-cancel-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default PropertyForm;
