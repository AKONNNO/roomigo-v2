// Payment helpers — developed by Prince Korankye Akonno

// Mobile money networks a student can pick from when paying.
export const MOMO_PROVIDERS = [
  { id: 'mtn', label: 'MTN Mobile Money', short: 'MTN MoMo', color: '#FFCC00', text: '#1f2937', icon: 'M' },
  { id: 'telecel', label: 'Telecel Cash', short: 'Telecel', color: '#0b6c5c', text: '#ffffff', icon: 'T' },
  { id: 'airteltigo', label: 'AirtelTigo Money', short: 'AirtelTigo', color: '#e4002b', text: '#ffffff', icon: 'A' }
];

// Human label for a provider id ("mtn" -> "MTN Mobile Money")
export const providerLabel = (id) => {
  const p = MOMO_PROVIDERS.find(x => x.id === id);
  return p ? p.label : id;
};

// True once the payment window set by the manager has passed
export const isExpired = (enquiry, now = new Date()) =>
  enquiry &&
  enquiry.status === 'approved' &&
  enquiry.paymentStatus !== 'paid' &&
  enquiry.paymentDeadline &&
  new Date(enquiry.paymentDeadline).getTime() < now.getTime();

// Milliseconds remaining before the deadline expires (0 when past)
export const timeLeft = (enquiry, now = new Date()) => {
  if (!enquiry || !enquiry.paymentDeadline) return null;
  const ms = new Date(enquiry.paymentDeadline).getTime() - now.getTime();
  return ms > 0 ? ms : 0;
};

// Human friendly countdown like "23h 59m" or "2d 4h"
export const formatCountdown = (ms) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
