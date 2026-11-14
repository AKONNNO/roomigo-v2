import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    const result = login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    const role = result.user?.role || 'student';
    if (role === 'admin') navigate('/admin');
    else if (role === 'manager') navigate('/manager');
    else navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in with your email and password — we'll take you to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your.email@stu.knust.edu.gh"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo logins</strong></p>
          <p>🎓 Student — <code>student@roomigo.gh</code> / <code>student123</code></p>
          <p>🛡️ Admin — <code>admin@roomigo.gh</code> / <code>admin123</code></p>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
