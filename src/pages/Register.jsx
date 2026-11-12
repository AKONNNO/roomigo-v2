import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', studentId: '', gender: '', password: '', confirmPassword: '', role: 'student'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    register(formData);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Roomigo to find your perfect hostel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your.email@stu.knust.edu.gh" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+233 XX XXX XXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input type="text" placeholder="e.g. 22512172" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>I am a...</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="manager">Hostel Manager</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
            </div>
          </div>
          
          <button type="submit" className="auth-btn">Create Account</button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
