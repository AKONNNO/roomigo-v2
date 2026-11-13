import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, MessageSquare, Check, X, Eye, Plus, Trash2, Pencil, BadgeCheck, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import { useProperty } from '../context/useProperty';
import PropertyForm from '../components/PropertyForm';
import './Admin.css';

const Admin = () => {
  const { user, users, updateUserRole } = useAuth();
  const { enquiries, bookings, updateEnquiryStatus, updateBookingStatus } = useBooking();
  const { propertiesList, addProperty, updateProperty, deleteProperty, toggleVerified } = useProperty();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const buildProperty = (form) => ({
    name: form.name, address: form.address, distance: form.distance,
    price: Number(form.price), priceType: form.priceType,
    rooms: Number(form.rooms) || 0,
    availableRooms: form.availableRooms !== '' ? Number(form.availableRooms) : Number(form.rooms) || 0,
    roomTypes: form.roomTypes || [],
    gender: form.gender,
    amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
    description: form.description,
    images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    manager: { name: form.managerName, phone: form.managerPhone, email: form.managerEmail }
  });

  const handleAdd = (form) => { addProperty(buildProperty(form)); setShowAddForm(false); };
  const handleEdit = (form) => { updateProperty(editing.id, buildProperty(form)); setEditing(null); };
  const countVerified = propertiesList.filter(p => p.verified).length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo"><Shield size={28} /><span>Roomigo Admin</span></div>
          <div className="admin-header-actions">
            <span className="admin-name">{user?.name} <span className="role-badge admin">🛡️ Admin</span></span>
            <button onClick={() => navigate('/')} className="back-to-site"><Eye size={18} /> View Site</button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <div className="stats-grid">
          <div className="admin-stat"><Home size={24} className="stat-icon" /><div><span className="stat-number">{propertiesList.length}</span><p>Properties</p></div></div>
          <div className="admin-stat"><BadgeCheck size={24} className="stat-icon verified" /><div><span className="stat-number">{countVerified}</span><p>Verified</p></div></div>
          <div className="admin-stat"><MessageSquare size={24} className="stat-icon" /><div><span className="stat-number">{enquiries.length}</span><p>Enquiries</p></div></div>
          <div className="admin-stat"><Plus size={24} className="stat-icon" /><div><span className="stat-number">{enquiries.filter(e => e.status === 'pending').length}</span><p>Pending</p></div></div>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties ({propertiesList.length})</button>
          <button className={`tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>Enquiries ({enquiries.length})</button>
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings ({bookings.length})</button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users ({users.length})</button>
        </div>

        <div className="admin-content">
          {activeTab === 'properties' && (
            <div className="data-table">
              <div className="section-toolbar">
                <h3>Listing Curation & Inventory</h3>
                <button className="add-property-btn" onClick={() => { setShowAddForm(!showAddForm); setEditing(null); }}>{showAddForm ? 'Close Form' : '+ Add Property'}</button>
              </div>

              {showAddForm && (
                <div className="form-panel">
                  <h4>New Property</h4>
                  <PropertyForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} submitLabel="Add Property" />
                </div>
              )}

              {editing && (
                <div className="form-panel">
                  <h4>Edit: {editing.name}</h4>
                  <PropertyForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} submitLabel="Save Changes" />
                </div>
              )}

              <table>
                <thead><tr><th>Name</th><th>Location</th><th>Price</th><th>Inventory</th><th>Verified</th><th>Actions</th></tr></thead>
                <tbody>
                  {propertiesList.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>{p.address}</td><td>GHS {p.price.toLocaleString()}</td><td>{p.availableRooms}/{p.rooms}</td>
                      <td>
                        <span className={`verify-badge ${p.verified ? 'yes' : 'no'}`}>{p.verified ? 'Yes' : 'No'}</span>
                        <button onClick={() => toggleVerified(p.id)} className="verify-toggle" title="Toggle verification"><BadgeCheck size={16} /></button>
                      </td>
                      <td>
                        <button onClick={() => setEditing(p)} className="action-btn edit" title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => { if (window.confirm(`Delete ${p.name}?`)) deleteProperty(p.id); }} className="action-btn reject" title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="data-table">
              <h3>Inquiry Management</h3>
              {enquiries.length > 0 ? (
                <table>
                  <thead><tr><th>ID</th><th>Property</th><th>Student</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {enquiries.map(e => (
                      <tr key={e.id}>
                        <td>#{e.id}</td><td>{e.propertyName}</td><td>{e.name}</td><td>{e.email}</td>
                        <td><span className={`status ${e.status}`}>{e.status}</span></td>
                        <td>{e.status === 'pending' && <>
                          <button onClick={() => updateEnquiryStatus(e.id, 'approved')} className="action-btn approve"><Check size={16} /></button>
                          <button onClick={() => updateEnquiryStatus(e.id, 'rejected')} className="action-btn reject"><X size={16} /></button>
                        </>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No enquiries yet.</p>}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="data-table">
              <h3>Bookings</h3>
              {bookings.length > 0 ? (
                <table>
                  <thead><tr><th>ID</th><th>Property</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td>#{b.id}</td><td>{b.propertyName || 'N/A'}</td><td><span className={`status ${b.status}`}>{b.status}</span></td>
                        <td>{b.status === 'pending' && <>
                          <button onClick={() => updateBookingStatus(b.id, 'approved')} className="action-btn approve"><Check size={16} /></button>
                          <button onClick={() => updateBookingStatus(b.id, 'rejected')} className="action-btn reject"><X size={16} /></button>
                        </>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No bookings yet.</p>}
            </div>
          )}


          {activeTab === 'users' && (
            <div className="data-table">
              <h3><Users size={18} /> Registered Users</h3>
              {users.length > 0 ? (
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Action</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === 'admin' ? 'admin' : u.role === 'manager' ? 'manager' : 'student'}`}>
                            {u.role === 'admin' ? '🛡️ Admin' : u.role === 'manager' ? '🏢 Hostel Manager' : '🎓 Student'}
                          </span>
                        </td>
                        <td>{u.phone || '—'}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <>
                              {u.role === 'manager' ? (
                                <button className="action-btn" onClick={() => updateUserRole(u.id, 'student')} title="Demote to student">Make Student</button>
                              ) : (
                                <button className="action-btn approve" onClick={() => updateUserRole(u.id, 'manager')} title="Promote to manager">Make Manager</button>
                              )}
                            </>
                          )}
                          {u.role === 'admin' && <span className="no-data">Protected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="no-data">No registered users yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
