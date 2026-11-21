// Manager page — developed by Prince Korankye Akonno
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, X, Eye, MessageSquare, LogOut, ClipboardList, Package, AlarmClock } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import { useProperty } from '../context/useProperty';
import PropertyForm from '../components/PropertyForm';
import './Manager.css';

const Manager = () => {
  const { user, logout } = useAuth();
  const { enquiries, bookings, updateEnquiryStatus, approveEnquiry, updateBookingStatus } = useBooking();
  const { propertiesList, addProperty, updateProperty, updateInventory } = useProperty();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [approveId, setApproveId] = useState(null);
  const [approveHours, setApproveHours] = useState('48');

  if (!user) return null;

  // Ask the manager how long the student has to pay, then approve.
  const handleApprove = (id) => {
    setApproveId(id);
    setApproveHours('48');
  };

  const confirmApprove = () => {
    const hours = Number(approveHours);
    if (!hours || hours <= 0) {
      alert('Please enter a valid number of hours for the payment window.');
      return;
    }
    approveEnquiry(approveId, hours);
    setApproveId(null);
  };

  const managedProperties = propertiesList.filter(p => p.manager?.email === user.email);
  const propsForDisplay = managedProperties.length > 0 ? managedProperties : propertiesList;
  const ids = propsForDisplay.map(p => p.id);
  const managedEnquiries = enquiries.filter(e => ids.includes(e.propertyId) || propsForDisplay.some(p => p.name === e.propertyName));
  const managedBookings = bookings.filter(b => ids.includes(b.propertyId) || propsForDisplay.some(p => p.name === b.propertyName));

  const buildProperty = (form) => {
    const roomPrices = (form.roomTypes || []).reduce((acc, rt) => {
      const v = Number(form.roomPrices && form.roomPrices[rt]);
      if (!Number.isNaN(v) && v > 0) acc[rt] = v;
      return acc;
    }, {});
    const firstRoomPrice = roomPrices[(form.roomTypes || [])[0]];
    return {
      name: form.name,
      address: form.address,
      distance: form.distance,
      price: Number(form.price) || firstRoomPrice || 0,
      priceType: form.priceType,
      rooms: Number(form.rooms) || 0,
      availableRooms: form.availableRooms !== '' ? Number(form.availableRooms) : (Number(form.rooms) || 0),
      roomTypes: form.roomTypes || [],
      roomPrices,
      roomImages: form.roomImages || {},
      gender: form.gender,
      amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
      description: form.description,
      images: Array.isArray(form.images) ? form.images.filter(Boolean) : (form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : undefined),
      manager: { name: form.managerName || user.name, phone: form.managerPhone || '', email: form.managerEmail || user.email }
    };
  };

  const handleAdd = (form) => { addProperty(buildProperty(form)); setShowAddForm(false); };
  const handleEdit = (form) => { updateProperty(editing.id, buildProperty(form)); setEditing(null); };
  const handleInventoryChange = (id, value) => updateInventory(id, value);
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="manager-dashboard">
      <header className="manager-header">
        <div className="manager-header-content">
          <div className="manager-logo"><Building2 size={26} /><span>Manager Portal</span></div>
          <div className="manager-header-actions">
            <span className="manager-name">{user.name} <span className="role-badge manager">🏢 Hostel Manager</span></span>
            <button onClick={() => navigate('/')} className="back-to-site"><Eye size={18} /> View Site</button>
            <button onClick={handleLogout} className="manager-logout"><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="manager-container">
        <div className="manager-greeting">
          <h1>Welcome, {user.name} 👋</h1>
          <p>Oversee your property listings, audit room availability, and process student reservation requests.</p>
          {managedProperties.length === 0 && (
            <div className="manager-setup-banner">
              <p><strong>Set up your hostel!</strong> Add your hostel name, images, room spaces and amenities to start receiving student enquiries.</p>
              <button onClick={() => { setActiveTab('properties'); setShowAddForm(true); }} className="add-property-btn">+ Add My Hostel</button>
            </div>
          )}
        </div>

        <div className="manager-tabs">
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}><Building2 size={18} /> My Properties ({propsForDisplay.length})</button>
          <button className={`tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}><MessageSquare size={18} /> Enquiries ({managedEnquiries.filter(e => e.status === 'pending').length})</button>
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}><ClipboardList size={18} /> Reservations ({managedBookings.length})</button>
        </div>

        <div className="manager-content">
          {activeTab === 'properties' && (
            <div className="manager-properties">
              <div className="section-toolbar">
                <h3>Property Listings & Inventory</h3>
                <button className="add-property-btn" onClick={() => { setShowAddForm(!showAddForm); setEditing(null); }}>{showAddForm ? 'Close Form' : '+ Add New Listing'}</button>
              </div>

              {showAddForm && (
                <div className="form-panel">
                  <h4>New Property Listing</h4>
                  <PropertyForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} submitLabel="Create Listing" />
                </div>
              )}

              {editing && (
                <div className="form-panel">
                  <h4>Edit: {editing.name}</h4>
                  <PropertyForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} submitLabel="Save Changes" />
                </div>
              )}

              <div className="manager-prop-list">
                {propsForDisplay.map(p => {
                  const onEdit = () => setEditing(p);
                  const onView = () => navigate(`/property/${p.id}`);
                  const onInv = (e) => handleInventoryChange(p.id, e.target.value);
                  
                  return (
                  <div key={p.id} className="manager-prop-card">
                    <img src={p.images?.[0]} alt={p.name} className="prop-thumb" />
                    <div className="prop-details">
                      <div className="prop-title-row">
                        <h4>{p.name}</h4>
                        {p.verified ? <span className="verify-flag yes"><Check size={12} /> Verified</span> : <span className="verify-flag no">Unverified</span>}
                      </div>
                      <p className="prop-address">{p.address} • {p.distance}</p>
                      <p className="prop-price">GHS {p.price.toLocaleString()} <small>{p.priceType}</small></p>
                      <div className="inventory-row">
                        <label><Package size={14} /> Available Rooms:</label>
                        <input type="number" min="0" max={p.rooms} value={p.availableRooms} onChange={onInv} className="inventory-input" />
                        <span className="of-total">of {p.rooms}</span>
                      </div>
                    </div>
                    <div className="prop-actions">
                      <button onClick={onEdit} className="edit-btn">Edit</button>
                      <button onClick={onView} className="view-btn">View</button>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          )}


          {activeTab === 'enquiries' && (
            <div className="manager-table">
              <h3>Student Enquiries for Your Properties</h3>
              {managedEnquiries.length > 0 ? (
                <table>
                  <thead><tr><th>Property</th><th>Student</th><th>Email</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {managedEnquiries.map(e => (
                      <tr key={e.id}>
                        <td>{e.propertyName}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td className="msg-cell">{e.message}</td>
                        <td><span className={`status ${e.status}`}>{e.status}</span></td>
                        <td>
                          {e.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(e.id)} className="action-btn approve" title="Approve (set payment window)"><Check size={16} /></button>
                              <button onClick={() => updateEnquiryStatus(e.id, 'rejected')} className="action-btn reject"><X size={16} /></button>
                            </>
                          )}
                          {e.status === 'approved' && e.paymentStatus !== 'paid' && (
                            <span className="status approved">Awaiting payment</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No enquiries for your properties yet.</p>}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="manager-table">
              <h3>Reservation Requests</h3>
              {managedBookings.length > 0 ? (
                <table>
                  <thead><tr><th>Property</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {managedBookings.map(b => (
                      <tr key={b.id}>
                        <td>{b.propertyName || 'N/A'}</td>
                        <td><span className={`status ${b.status}`}>{b.status}</span></td>
                        <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td>
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateBookingStatus(b.id, 'approved')} className="action-btn approve"><Check size={16} /></button>
                              <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="action-btn reject"><X size={16} /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No reservation requests yet.</p>}
            </div>
          )}
        </div>
      </div>

      {approveId != null && (
        <div className="approve-modal-overlay" onClick={() => setApproveId(null)}>
          <div className="approve-modal" onClick={(ev) => ev.stopPropagation()}>
            <div className="approve-modal-icon"><AlarmClock size={28} /></div>
            <h4>Approve Enquiry &amp; Set Payment Window</h4>
            <p>How many hours does the student have to complete payment after approval?</p>
            <div className="approve-input-row">
              <input
                type="number"
                min="1"
                value={approveHours}
                onChange={(e) => setApproveHours(e.target.value)}
                placeholder="e.g. 48"
              />
              <span className="approve-unit">hours</span>
            </div>
            <div className="approve-modal-actions">
              <button onClick={() => setApproveId(null)} className="approve-cancel">Cancel</button>
              <button onClick={confirmApprove} className="approve-confirm"><Check size={16} /> Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
