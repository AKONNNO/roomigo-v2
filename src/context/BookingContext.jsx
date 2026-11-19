// BookingContext — developed by Prince Korankye Akonno
import { useState } from 'react';
import { BookingContext } from './booking-context';

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem('roomigo_bookings');
    return stored ? JSON.parse(stored) : [];
  });

  const [enquiries, setEnquiries] = useState(() => {
    const stored = localStorage.getItem('roomigo_enquiries');
    return stored ? JSON.parse(stored) : [];
  });

  const createBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('roomigo_bookings', JSON.stringify(updatedBookings));
    
    return newBooking;
  };

  const createEnquiry = (enquiryData) => {
    const newEnquiry = {
      id: Date.now(),
      ...enquiryData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const updatedEnquiries = [...enquiries, newEnquiry];
    setEnquiries(updatedEnquiries);
    localStorage.setItem('roomigo_enquiries', JSON.stringify(updatedEnquiries));
    
    return newEnquiry;
  };

  const updateBookingStatus = (bookingId, status) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status, updatedAt: new Date().toISOString() }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('roomigo_bookings', JSON.stringify(updatedBookings));
  };

  // Set an enquiry's status. Extra fields (e.g. paymentDeadline when
  // approving) can be passed through `options` and are merged onto the enquiry.
  const updateEnquiryStatus = (enquiryId, status, options = {}) => {
    const updatedEnquiries = enquiries.map(enquiry => 
      enquiry.id === Number(enquiryId) ? { ...enquiry, status, ...options } : enquiry
    );
    setEnquiries(updatedEnquiries);
    localStorage.setItem('roomigo_enquiries', JSON.stringify(updatedEnquiries));
  };

  // Approve an enquiry and start the payment window. The manager supplies the
  // number of hours the student has to complete payment (e.g. 48).
  const approveEnquiry = (enquiryId, hours = 48) => {
    const approvedAt = new Date();
    const paymentDeadline = new Date(approvedAt.getTime() + hours * 60 * 60 * 1000).toISOString();
    updateEnquiryStatus(enquiryId, 'approved', {
      approvedAt: approvedAt.toISOString(),
      paymentDeadline,
      paymentStatus: 'pending'
    });
  };

  // Record a successful Paystack payment against the enquiry.
  const recordPayment = (enquiryId, details = {}) => {
    const updatedEnquiries = enquiries.map(enquiry =>
      enquiry.id === Number(enquiryId)
        ? {
            ...enquiry,
            paymentStatus: 'paid',
            paidAt: new Date().toISOString(),
            paymentMethod: details.method || enquiry.paymentMethod || 'Mobile Money',
            paymentProvider: details.provider || enquiry.paymentProvider || '',
            paymentReference: details.reference || 'ROOMIGO-' + Math.random().toString(36).slice(2, 10).toUpperCase()
          }
        : enquiry
    );
    setEnquiries(updatedEnquiries);
    localStorage.setItem('roomigo_enquiries', JSON.stringify(updatedEnquiries));
  };

  // Approved enquiries still waiting for payment (drives the top banner).
  const getUserUnpaidApproved = (userId) =>
    enquiries.filter(e => e.userId === userId && e.status === 'approved' && e.paymentStatus !== 'paid');

  const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getUserEnquiries = (userId) => {
    return enquiries.filter(enquiry => enquiry.userId === userId);
  };

  const getPropertyBookings = (propertyId) => {
    return bookings.filter(booking => booking.propertyId === propertyId);
  };

  const getPropertyEnquiries = (propertyId) => {
    return enquiries.filter(enquiry => enquiry.propertyId === propertyId);
  };

  const value = {
    bookings,
    enquiries,
    createBooking,
    createEnquiry,
    updateBookingStatus,
    updateEnquiryStatus,
    approveEnquiry,
    recordPayment,
    getUserUnpaidApproved,
    getUserBookings,
    getUserEnquiries,
    getPropertyBookings,
    getPropertyEnquiries
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
