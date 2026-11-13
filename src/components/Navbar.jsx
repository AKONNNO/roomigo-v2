import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">Roomigo</span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Find Hostel</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              <Shield size={16} /> Admin
            </Link>
          )}
          {isManager && (
            <Link to="/manager" className="nav-link">Manager Panel</Link>
          )}
        </div>

        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={16} /> {user?.name || user?.email?.split('@')[0]}
              </span>
              {isManager && <span className="role-badge manager">🏢 Manager</span>}
              {isAdmin && <span className="role-badge admin">🛡️ Admin</span>}
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)}>Find Hostel</Link>
          {isAuthenticated && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
