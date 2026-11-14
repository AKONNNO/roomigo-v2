import { Link } from 'react-router-dom';
import './Footer.css';

// Computed once at module load (not during render) so the year stays pure
const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">🏠 Roomigo</h3>
          <p>Your trusted platform for finding quality student accommodation near KNUST campus.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Browse hostels</Link></li>
            <li><Link to="/#how-it-works">How it works</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>For Students</h4>
          <ul>
            <li><Link to="/search?gender=female">Female hostels</Link></li>
            <li><Link to="/search?gender=male">Male hostels</Link></li>
            <li><Link to="/search?budget=2000">Under GH₵ 2,000</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 info@roomigo.gh</p>
          <p>📱 +233 20 123 4567</p>
          <p>📍 Kumasi, Ghana</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Roomigo. BIT 293 Capstone Project - KNUST</p>
      </div>
    </footer>
  );
};

export default Footer;
