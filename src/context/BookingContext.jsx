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

  const updateEnquiryStatus = (enquiryId, status) => {
    const updatedEnquiries = enquiries.map(enquiry => 
      enquiry.id === enquiryId ? { ...enquiry, status } : enquiry
    );
    setEnquiries(updatedEnquiries);
    localStorage.setItem('roomigo_enquiries', JSON.stringify(updatedEnquiries));
  };

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
