import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useProperty } from '../context/useProperty';
import { roomTypeOptions, amenityOptions } from '../data/additionalProperties';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', studentId: '', gender: '', password: '', confirmPassword: '',
    role: 'student',
    hostelName: '', hostelAddress: '', distance: '', price: '', priceType: 'per semester',
    rooms: '', availableRooms: '', roomTypes: [], hostelGender: 'Mixed', amenities: [], images: '', description: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { addProperty } = useProperty();
  const navigate = useNavigate();

  const setField = (key, value) => setFormData({ ...formData, [key]: value });

  const togglePill = (key, value) => {
    const list = formData[key];
    setField(key, list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in your name, email and password.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.role === 'manager' && (!formData.hostelName || !formData.hostelAddress || !formData.rooms)) {
      setError('As a hostel manager, please fill in the hostel name, location and total rooms.');
      return;
    }
    const result = register(formData);
    if (!result.success) {
      setError(result.message);
      return;
    }
    if (formData.role === 'manager') {
      addProperty({
        name: formData.hostelName,
        address: formData.hostelAddress,
        distance: formData.distance,
        price: Number(formData.price) || 0,
        priceType: formData.priceType,
        rooms: Number(formData.rooms) || 0,
        availableRooms: formData.availableRooms !== '' ? Number(formData.availableRooms) : (Number(formData.rooms) || 0),
        roomTypes: formData.roomTypes.length ? formData.roomTypes : [1, 2],
        gender: formData.hostelGender,
        amenities: formData.amenities,
        description: formData.description,
        images: formData.images,
        manager: { name: formData.name, phone: formData.phone, email: formData.email.trim().toLowerCase() }
      });
      navigate('/manager');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Roomigo — sign in with your email and your account type is found automatically</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>I am signing up as...</label>
            <div className="role-selector">
              <button type="button" className={`role-card ${formData.role === 'student' ? 'active' : ''}`} onClick={() => setField('role', 'student')}>
                <User size={22} /><div><strong>Student</strong><span>Looking for a hostel</span></div>
              </button>
              <button type="button" className={`role-card ${formData.role === 'manager' ? 'active' : ''}`} onClick={() => setField('role', 'manager')}>
                <Building2 size={22} /><div><strong>Hostel Manager</strong><span>List & manage my hostel</span></div>
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your.email@stu.knust.edu.gh" value={formData.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+233 XX XXX XXXX" value={formData.phone} onChange={(e) => setField('phone', e.target.value)} />
            </div>
            {formData.role === 'student' && (
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" placeholder="e.g. 22512172" value={formData.studentId} onChange={(e) => setField('studentId', e.target.value)} />
              </div>
            )}
          </div>
          
          {formData.role === 'student' ? (
            <div className="form-group">
              <label>Gender</label>
              <select value={formData.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Hostel Type</label>
              <select value={formData.hostelGender} onChange={(e) => setField('hostelGender', e.target.value)}>
                <option value="Mixed">Mixed</option>
                <option value="Male Only">Male Only</option>
                <option value="Female Only">Female Only</option>
              </select>
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setField('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} />
            </div>
          </div>
          
          {formData.role === 'manager' && (
            <div className="hostel-setup">
              <h3>🏢 Your Hostel Information</h3>
              <p className="hostel-setup-hint">Tell students about your hostel so they can find you.</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Hostel Name</label>
                  <input type="text" placeholder="e.g. Kwahu Heights" value={formData.hostelName} onChange={(e) => setField('hostelName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Location / Address</label>
                  <input type="text" placeholder="e.g. Kumasi, Ayigya" value={formData.hostelAddress} onChange={(e) => setField('hostelAddress', e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Distance from Campus</label>
                  <input type="text" placeholder="e.g. 1.5 km" value={formData.distance} onChange={(e) => setField('distance', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Price (GHS)</label>
                  <input type="number" placeholder="e.g. 2500" value={formData.price} onChange={(e) => setField('price', e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Rooms</label>
                  <input type="number" placeholder="e.g. 20" value={formData.rooms} onChange={(e) => setField('rooms', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Available Rooms</label>
                  <input type="number" placeholder="e.g. 5" value={formData.availableRooms} onChange={(e) => setField('availableRooms', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Available Room Configurations</label>
                <div className="pill-options">
                  {roomTypeOptions.map(opt => (
                    <label key={opt.value} className={`pill ${formData.roomTypes.includes(opt.value) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={formData.roomTypes.includes(opt.value)} onChange={() => togglePill('roomTypes', opt.value)} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Amenities Offered</label>
                <div className="pill-options">
                  {amenityOptions.map(a => (
                    <label key={a} className={`pill ${formData.amenities.includes(a) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={formData.amenities.includes(a)} onChange={() => togglePill('amenities', a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Image URLs (comma separated)</label>
                <input type="text" placeholder="https://image1.jpg, https://image2.jpg" value={formData.images} onChange={(e) => setField('images', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" placeholder="Describe your hostel..." value={formData.description} onChange={(e) => setField('description', e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {formData.role === 'manager' ? 'Create Manager Account & My Hostel' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
