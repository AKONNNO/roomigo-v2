import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, User, Settings, LogOut, Check, Clock, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { enquiries } = useBooking();
  const navigate = useNavigate();

  const userEnquiries = enquiries.filter(e => e.userId === user?.id);
  const pendingEnquiries = userEnquiries.filter(e => e.status === 'pending');
  const approvedEnquiries = userEnquiries.filter(e => e.status === 'approved');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>🏠 Roomigo</h2>
          <p>Student Dashboard</p>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><Home size={20} /> Home</Link>
          <Link to="/search" className="nav-item"><Home size={20} /> Find Hostel</Link>
          <Link to="/dashboard" className="nav-item active"><User size={20} /> My Dashboard</Link>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name || 'Student'}!</h1>
            <p>Manage your hostel enquiries and bookings</p>
            <span className="role-badge student">🎓 You are signed in as a Student</span>
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon pending"><Clock size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{pendingEnquiries.length}</span>
              <span className="stat-label">Pending Enquiries</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved"><Check size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{approvedEnquiries.length}</span>
              <span className="stat-label">Approved Bookings</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total"><MessageSquare size={24} /></div>
            <div className="stat-info">
              <span className="stat-value">{userEnquiries.length}</span>
              <span className="stat-label">Total Enquiries</span>
            </div>
          </div>
        </div>

        <section className="enquiries-section">
          <h2><MessageSquare size={20} /> My Enquiries</h2>
          
          {userEnquiries.length > 0 ? (
            <div className="enquiries-list">
              {userEnquiries.map(enquiry => (
                <div key={enquiry.id} className="enquiry-card">
                  <div className="enquiry-header">
                    <h3>{enquiry.propertyName}</h3>
                    <span className={`status-badge ${enquiry.status}`}>
                      {enquiry.status === 'pending' && <Clock size={14} />}
                      {enquiry.status === 'approved' && <Check size={14} />}
                      {enquiry.status === 'rejected' && <X size={14} />}
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="enquiry-message">{enquiry.message}</p>
                  <div className="enquiry-meta">
                    <span>Submitted: {new Date(enquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-enquiries">
              <p>You haven't made any enquiries yet.</p>
              <Link to="/search" className="search-btn">Find a Hostel</Link>
            </div>
          )}
        </section>

        <section className="profile-section">
          <h2><Settings size={20} /> Profile Information</h2>
          <div className="profile-card">
            <div className="profile-field"><label>Name:</label><span>{user?.name || 'Not set'}</span></div>
            <div className="profile-field"><label>Email:</label><span>{user?.email || 'Not set'}</span></div>
            <div className="profile-field"><label>Role:</label><span className="role-badge student">🎓 Student</span></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
