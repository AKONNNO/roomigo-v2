import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Users, Star, ArrowRight, Building2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/useProperty';
import { locations } from '../data/additionalProperties';
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
  const navigate = useNavigate();
  const [heroLocation, setHeroLocation] = useState('All Locations');
  const [heroBudget, setHeroBudget] = useState('');
  const featuredProperties = propertiesList.filter(p => p.verified).slice(0, 3);
  const featuredForDisplay = featuredProperties.length > 0 ? featuredProperties : propertiesList.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find your room near&nbsp;KNUST.</h1>
          <p>Compare verified hostels by price, walking time and amenities.</p>
          <form className="hero-search" onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            if (heroLocation && heroLocation !== 'All Locations') params.set('location', heroLocation);
            if (heroBudget) params.set('budget', heroBudget);
            navigate(`/search?${params.toString()}`);
          }}>
            <span className="hero-search-icon"><Search size={18} /></span>
            <select
              aria-label="Location"
              value={heroLocation}
              onChange={(e) => setHeroLocation(e.target.value)}
              className="hero-select"
            >
              <option value="All Locations">All locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <span className="hero-search-divider"></span>
            <span className="hero-search-icon cedi">GH₵</span>
            <input
              type="number"
              min="0"
              placeholder="Max budget / year"
              value={heroBudget}
              onChange={(e) => setHeroBudget(e.target.value)}
              className="hero-input"
            />
            <button type="submit" className="hero-search-btn">
              Search hostels
            </button>
          </form>
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
      <section className="featured-listings" id="verified">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">Verified hostels</span>
              <h2>Browse verified hostels</h2>
            </div>
            <Link to="/search" className="view-all">
              View all hostels <ArrowRight size={16} />
            </Link>
          </div>
          <div className="listings-grid">
            {featuredForDisplay.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="popular-areas">
        <div className="container">
          <span className="section-label">Popular areas</span>
          <h2>Where students live</h2>
          <div className="areas-grid">
            {['Ayeduase', 'Kotei', 'Bomso', 'Kentinkrono'].map(area => (
              <Link key={area} to={`/search?location=${encodeURIComponent(area)}`} className="area-chip">
                <Building2 size={18} /> {area}
              </Link>
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
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <span className="section-label">How Roomigo works</span>
          <h2>Three steps to your new room</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search and filter</h3>
              <p>Filter verified hostels by location, budget, walking time and amenities.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Compare in detail</h3>
              <p>Compare prices, room configurations and facilities side by side.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Send an enquiry</h3>
              <p>Send a booking enquiry to the hostel manager and track it in your dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
