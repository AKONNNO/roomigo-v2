// Paystack checkout page — developed by Prince Korankye Akonno
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, Loader } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useBooking } from '../context/useBooking';
import { useProperty } from '../context/useProperty';
import { providerLabel } from '../utils/payment';
import './Payment.css';

// Live Paystack public key (from .env). When set, the real Paystack inline
// checkout is used. Without it, a safe local demo runs instead (no charge).
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

// Ensure the Paystack inline script (window.PaystackPop) is available, even if
// the <script> tag in index.html hasn't finished loading yet.
const ensurePaystackScript = () =>
  new Promise((resolve) => {
    if (window.PaystackPop) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaystackCheckout = () => {
  const { enquiryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enquiries, recordPayment } = useBooking();
  const { getProperty } = useProperty();

  const enquiry = enquiries.find(e => e.id === Number(enquiryId));
  const property = enquiry ? getProperty(enquiry.propertyId) : null;

  const method = searchParams.get('method') || 'momo';
  const provider = searchParams.get('provider') || '';
  const phone = searchParams.get('phone') || '';
  const amount = Number(searchParams.get('amount')) || Number(enquiry?.amount) || (property?.price || 0);

  const [stage, setStage] = useState('ready'); // 'ready' | 'processing' | 'success' | 'failed'
  const [error, setError] = useState('');
  const [scriptReady, setScriptReady] = useState(!!PAYSTACK_PUBLIC_KEY);
  const processingRef = useRef(false);

  // Demo-only processing delay (used when no Paystack key is configured).
  // Records the payment so the approval banner disappears, matching the
  // behaviour of a real Paystack success callback.
  useEffect(() => {
    if (!PAYSTACK_PUBLIC_KEY && stage === 'processing' && !processingRef.current) {
      processingRef.current = true;
      const timer = setTimeout(() => {
        recordPayment(enquiry?.id, { method, provider, phone, reference: 'DEMO' });
        setStage('success');
      }, 2200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Pre-load the Paystack library as soon as the page mounts.
  useEffect(() => {
    if (!PAYSTACK_PUBLIC_KEY) return;
    ensurePaystackScript().then((ok) => setScriptReady(ok));
  }, []);

  if (!enquiry) {
    return (
      <div className="payment-page">
        <div className="payment-not-found">
          <h2>Checkout unavailable</h2>
          <p>The enquiry linked to this checkout no longer exists.</p>
          <Link to="/dashboard" className="payment-btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleSuccess = (response) => {
    processingRef.current = false;
    recordPayment(enquiry.id, {
      method,
      provider,
      phone,
      reference: response?.reference || 'PAYSTACK'
    });
    setStage('success');
  };


  const livePay = async () => {
    setError('');
    if (!PAYSTACK_PUBLIC_KEY) {
      // No key configured — demo flow (frontend only, no real charge).
      setStage('processing');
      return;
    }
    const ok = await ensurePaystackScript();
    if (!ok || !window.PaystackPop) {
      setError('Paystack could not be loaded. Please try again.');
      setStage('failed');
      return;
    }
    setStage('processing');
    processingRef.current = true;
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user?.email || enquiry.email || 'student@roomigo.gh',
      amount: Math.round(amount * 100), // amount in pesewas
      currency: 'GHS',
      channels: method === 'momo' ? ['mobile_money'] : ['card'],
      metadata: {
        custom_fields: [
          { display_name: 'Property', variable_name: 'property', value: property?.name || enquiry.propertyName },
          { display_name: 'Payment Method', variable_name: 'method', value: method === 'momo' ? (providerLabel(provider) || 'Mobile Money') : 'Bank Card' }
        ]
      },
      callback: handleSuccess,
      onClose: () => { processingRef.current = false; setStage('ready'); }
    });
    handler.openIframe();
  };

  const hasLiveKey = !!PAYSTACK_PUBLIC_KEY;


  return (
    <div className="payment-page">
      <div className="payment-container">
        <button className="payment-back" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

        <div className="payment-card paystack-card">
          <div className="paystack-brand">
            <span className="paystack-logo">P</span>
            <span className="paystack-name">Paystack</span>
          </div>

          <div className="checkout-summary">
            <h2>{property?.name || enquiry.propertyName}</h2>
            <p>
              Paying with <strong>{method === 'momo' ? (providerLabel(provider) || 'Mobile Money') : 'Bank Card'}</strong>
              {method === 'momo' && phone ? <> • <span className="muted">{phone}</span></> : null}
            </p>
            <div className="checkout-amount">
              <span>Total</span>
              <strong>GHS {amount.toLocaleString()}</strong>
            </div>
          </div>

          {stage === 'ready' && (
            <>
              <button onClick={livePay} className="paystack-btn big">
                <Lock size={18} /> {hasLiveKey ? 'Pay Securely with Paystack' : `Pay GHS ${amount.toLocaleString()}`}
              </button>
              {hasLiveKey && !scriptReady && (
                <p className="secure-note">Loading secure payment gateway...</p>
              )}
              {hasLiveKey && method === 'momo' && (
                <p className="secure-note small">You'll receive a payment prompt from {providerLabel(provider)} on {phone || 'your phone'}.</p>
              )}
              <p className="secure-note"><ShieldCheck size={14} /> PCI-DSS compliant · 256-bit encrypted</p>
            </>
          )}

          {stage === 'processing' && (
            <div className="processing-state">
              <Loader className="spin" size={30} />
              <p>{hasLiveKey ? 'Completing your secure payment...' : `Processing your ${method === 'momo' ? (providerLabel(provider) || 'mobile money') : 'card'} payment...`}</p>
              {hasLiveKey && method === 'momo' && <p className="muted small">Follow the prompt on {phone} to approve this payment.</p>}
            </div>
          )}

          {stage === 'success' && (
            <div className="success-state">
              <CheckCircle2 size={44} color="var(--teal)" />
              <h3>Payment Successful!</h3>
              <p>Your enquiry has been marked as paid.</p>
              <div className="success-details">
                <div><span>Amount</span><strong>GHS {amount.toLocaleString()}</strong></div>
                {method === 'momo' && <div><span>Method</span><strong>{providerLabel(provider)}</strong></div>}
                <div><span>Status</span><strong className="ok">Paid</strong></div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="paystack-btn">Go to Dashboard</button>
            </div>
          )}

          {stage === 'failed' && (
            <div className="failed-state">
              <h3>Payment failed</h3>
              <p>{error || 'Something went wrong. Please try again.'}</p>
              <button onClick={() => setStage('ready')} className="paystack-btn">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaystackCheckout;

