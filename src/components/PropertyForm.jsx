import { useState } from 'react';
import { roomTypeOptions } from '../data/additionalProperties';
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
    gender: initialData.gender || 'Mixed',
    amenities: initialData.amenities ? initialData.amenities.join(', ') : '',
    description: initialData.description || '',
    images: initialData.images ? initialData.images.join(', ') : '',
    managerName: initialData.manager?.name || '',
    managerPhone: initialData.manager?.phone || '',
    managerEmail: initialData.manager?.email || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoomTypeToggle = (value) => {
    setForm({
      ...form,
      roomTypes: form.roomTypes.includes(value)
        ? form.roomTypes.filter(v => v !== value)
        : [...form.roomTypes, value]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.price) {
      alert('Please fill in all required fields (name, address, price).');
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
          <label>Price (GHS) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 2500" required />
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
          <label>Image URLs (comma separated)</label>
          <input name="images" value={form.images} onChange={handleChange} placeholder="https://image1.jpg, https://image2.jpg" />
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
