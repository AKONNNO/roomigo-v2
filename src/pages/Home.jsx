import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Users, Star, ArrowRight, Building2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/useProperty';
import './Home.css';

// Animated counter that counts up from 0 to `target` when it appears on screen
const StatCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out for a natural feel
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return <span className="stat-number">{value}{suffix}</span>;
};

const Home = () => {
  const { propertiesList } = useProperty();
  const featuredProperties = propertiesList.filter(p => p.verified).slice(0, 3);
  const featuredForDisplay = featuredProperties.length > 0 ? featuredProperties : propertiesList.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find Your Perfect Home Away From Home</h1>
          <p>Discover verified hostels and accommodation near KNUST campus. No more middlemen, no more stress.</p>
          <div className="hero-search">
            <Link to="/search" className="hero-search-btn">
              <Search size={20} /> Find Hostel Now
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <StatCounter target={500} suffix="+" />
              <span className="stat-label">Listings</span>
            </div>
            <div className="stat">
              <StatCounter target={2000} suffix="+" />
              <span className="stat-label">Students Housed</span>
            </div>
            <div className="stat">
              <StatCounter target={50} suffix="+" />
              <span className="stat-label">Verified Managers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Roomigo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Shield className="feature-icon" size={40} />
              <h3>Verified Listings</h3>
              <p>All properties are verified by our team to ensure quality and authenticity.</p>
            </div>
            <div className="feature-card">
              <Building2 className="feature-icon" size={40} />
              <h3>Wide Selection</h3>
              <p>Choose from a variety of hostels matching your budget and preferences.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" size={40} />
              <h3>Direct Contact</h3>
              <p>Connect directly with hostel managers without middleman fees.</p>
            </div>
            <div className="feature-card">
              <Star className="feature-icon" size={40} />
              <h3>Real Reviews</h3>
              <p>Read genuine reviews from students who have lived in the hostels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="featured-listings">
        <div className="container">
          <div className="section-header">
            <h2>Featured Hostels</h2>
            <Link to="/search" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="listings-grid">
            {featuredForDisplay.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Are You a Hostel Manager?</h2>
          <p>List your property on Roomigo and reach thousands of KNUST students looking for accommodation.</p>
          <Link to="/register" className="cta-btn">Register Your Hostel</Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Browse and filter hostels based on your preferences and budget.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Compare</h3>
              <p>View detailed information, photos, and reviews to make an informed decision.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book</h3>
              <p>Submit a booking enquiry directly to the hostel manager.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Move In</h3>
              <p>Get confirmation and move into your new home!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
