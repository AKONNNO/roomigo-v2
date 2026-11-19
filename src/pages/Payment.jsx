// Payment page — developed by Prince Korankye Akonno
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Smartphone, CreditCard, Lock, BadgeCheck, ArrowLeft, ShieldCheck, Timer } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import { useProperty } from '../context/useProperty';
import { isExpired, timeLeft, formatCountdown, MOMO_PROVIDERS } from '../utils/payment';
import './Payment.css';

const Payment = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enquiries } = useBooking();
  const { getProperty } = useProperty();

  const enquiry = enquiries.find(e => e.id === Number(enquiryId));
  const property = enquiry ? getProperty(enquiry.propertyId) : null;

  const [method, setMethod] = useState(null); // 'momo' | 'card'
  const [provider, setProvider] = useState(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');

  if (!enquiry) {
    return (
      <div className="payment-page">
        <div className="payment-not-found">
          <h2>Payment link not found</h2>
          <p>This enquiry no longer exists or the payment link is invalid.</p>
          <Link to="/dashboard" className="payment-btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const expired = isExpired(enquiry);
  const remaining = timeLeft(enquiry);
  const alreadyPaid = enquiry.paymentStatus === 'paid';
  const amount = Number(enquiry.amount) || (property?.price || 0);

  const handleProceed = () => {
    if (!method) {
      setError('Please choose a payment method first.');
      return;
    }
    if (method === 'momo' && !provider) {
      setError('Please choose your mobile money network.');
      return;
    }
    if (method === 'momo' && (!phone || phone.replace(/\D/g, '').length < 9)) {
      setError('Please enter a valid mobile money number.');
      return;
    }
    setError('');
    const qs = new URLSearchParams({ method, provider: provider || '', phone: phone || '', amount });
    navigate(`/paystack/${enquiry.id}?${qs.toString()}`);
  };

  const renderStatus = () => {
    if (alreadyPaid) {
      return (
        <div className="payment-alert paid">
          <BadgeCheck size={20} />
          <span>This enquiry has already been paid. Thank you!</span>
        </div>
      );
    }
    if (expired) {
      return (
        <div className="payment-alert expired">
          <Timer size={20} />
          <span>The payment deadline for this enquiry has passed. Please contact the hostel manager.</span>
        </div>
      );
    }
    if (enquiry.status === 'approved') {
      return (
        <div className="payment-alert approved">
          <Timer size={20} />
          <span>Your enquiry was approved! Please complete payment within <strong>{remaining != null ? formatCountdown(remaining) : '—'}</strong>.</span>
        </div>
      );
    }
    return (
      <div className="payment-alert warning">
        <Timer size={20} />
        <span>This enquiry has not been approved yet. You can only pay after a manager approves it.</span>
      </div>
    );
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Link to="/dashboard" className="payment-back"><ArrowLeft size={16} /> Back to Dashboard</Link>

        <div className="payment-card">
          <div className="payment-card-header">
            <div className="payment-icon"><Smartphone size={28} /></div>
            <div>
              <h1>Secure Payment</h1>
              <p>{property?.name || enquiry.propertyName}</p>
            </div>
            <div className="payment-amount">
              <span className="amount-label">Amount due</span>
              <span className="amount-value">GHS {amount.toLocaleString()}</span>
              {enquiry.priceType && <span className="amount-type">{enquiry.priceType}{enquiry.roomType ? ` • ${enquiry.roomType} in a room` : ''}</span>}
            </div>
          </div>

          {renderStatus()}

          {!alreadyPaid && !expired && enquiry.status === 'approved' && (
            <>
              <fieldset className="payment-step">
                <legend><span className="step-num">1</span> Choose payment method</legend>
                <div className="method-grid">
                  <button
                    type="button"
                    className={`method-card ${method === 'momo' ? 'selected' : ''}`}
                    onClick={() => { setMethod('momo'); setError(''); }}
                  >
                    <Smartphone size={26} />
                    <span className="method-title">Mobile Money</span>
                    <span className="method-desc">MTN, Telecel or AirtelTigo</span>
                  </button>
                  <button
                    type="button"
                    className={`method-card ${method === 'card' ? 'selected' : ''}`}
                    onClick={() => { setMethod('card'); setError(''); }}
                  >
                    <CreditCard size={26} />
                    <span className="method-title">Bank Card</span>
                    <span className="method-desc">Visa, Mastercard, Verve</span>
                  </button>
                </div>
              </fieldset>

              {method === 'momo' && (
                <fieldset className="payment-step">
                  <legend><span className="step-num">2</span> Choose your mobile money network</legend>
                  <div className="provider-grid">
                    {MOMO_PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`provider-card ${provider === p.id ? 'selected' : ''}`}
                        onClick={() => { setProvider(p.id); setError(''); }}
                      >
                        <span className="provider-logo" style={{ background: p.color, color: p.text }}>
                          {p.icon}
                        </span>
                        <span className="provider-label">{p.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="phone-field">
                    <label>Mobile money number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 024 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </fieldset>
              )}

              {method === 'card' && (
                <fieldset className="payment-step">
                  <legend><span className="step-num">2</span> Card payment</legend>
                  <p className="card-hint">
                    <CreditCard size={16} /> You will be taken to the secure Paystack checkout to enter your card details.
                  </p>
                </fieldset>
              )}

              {error && <div className="payment-error">{error}</div>}

              <div className="payment-actions">
                <button onClick={handleProceed} className="paystack-btn">
                  <Lock size={16} /> Proceed to Paystack
                </button>
                <p className="secure-note">
                  <ShieldCheck size={14} /> Secured by Paystack. Your payment details are encrypted.
                </p>
              </div>
            </>
          )}

          {alreadyPaid && (
            <div className="payment-actions">
              <Link to="/dashboard" className="paystack-btn">Go to Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;

