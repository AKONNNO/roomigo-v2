// PropertyContext — developed by Prince Korankye Akonno
import { useState, useEffect } from 'react';
import properties from '../data/properties';
import { additionalProperties } from '../data/additionalProperties';
import { PropertyContext } from './property-context';

const allInitial = [...properties, ...additionalProperties];

export const PropertyProvider = ({ children }) => {
  const [propertiesList, setPropertiesList] = useState(() => {
    const stored = localStorage.getItem('roomigo_properties');
    const parsed = stored ? JSON.parse(stored) : allInitial;
    // Backfill roomTypes for properties saved before the room-type feature
    // was added, using the seed data as the source of truth.
    return parsed.map(p => {
      const seed = allInitial.find(s => s.id === p.id) || {};
      const hasRoomTypes = p.roomTypes && p.roomTypes.length > 0;
      const hasRoomPrices = p.roomPrices && Object.keys(p.roomPrices).length > 0;
      return {
        ...p,
        roomTypes: hasRoomTypes ? p.roomTypes : (seed.roomTypes || []),
        roomPrices: hasRoomPrices ? p.roomPrices : (seed.roomPrices || {}),
        // Per-room-configuration photos saved by the manager/seed data.
        roomImages: p.roomImages && typeof p.roomImages === 'object'
          ? { ...p.roomImages }
          : (seed.roomImages || {}),
        // Student-submitted reviews persist on the property in localStorage.
        reviewsList: Array.isArray(p.reviewsList) ? [...p.reviewsList] : []
      };
    });
  });

  useEffect(() => {
    try {
      localStorage.setItem('roomigo_properties', JSON.stringify(propertiesList));
    } catch (err) {
      // Data-URL images can exceed the browser's localStorage quota. Keep the
      // in-memory state working and surface a clear warning instead of crashing.
      console.warn('Could not persist properties to localStorage:', err.message);
    }
  }, [propertiesList]);

  // Normalize both sides to string so numeric seed ids (1) and the
  // string param from the URL ("1") always match.
  const getProperty = (id) => propertiesList.find(p => String(p.id) === String(id));

  const addProperty = (data) => {
    // images may arrive as an array (Admin/Manager buildProperty) or a
    // comma-separated string (Registration form) - normalize to an array.
    const rawImages = Array.isArray(data.images)
      ? data.images
      : typeof data.images === 'string'
        ? data.images.split(',')
        : [];
    const cleanImages = rawImages.map(s => String(s).trim()).filter(Boolean);
    const newProperty = {
      id: Date.now(),
      images: cleanImages.length ? cleanImages : [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      rating: 0,
      reviews: 0,
      verified: false,
      ...data
    };
    setPropertiesList([newProperty, ...propertiesList]);
    return newProperty;
  };

  const updateProperty = (id, updates) => {
    setPropertiesList(propertiesList.map(p =>
      p.id === Number(id) ? { ...p, ...updates } : p
    ));
  };

  const deleteProperty = (id) => {
    setPropertiesList(propertiesList.filter(p => p.id !== Number(id)));
  };

  const toggleVerified = (id) => {
    setPropertiesList(propertiesList.map(p =>
      p.id === Number(id) ? { ...p, verified: !p.verified } : p
    ));
  };

  const updateInventory = (id, availableRooms) => {
    setPropertiesList(propertiesList.map(p =>
      p.id === Number(id) ? { ...p, availableRooms: Number(availableRooms) } : p
    ));
  };

  // Add (or update) a student's review for a property and recompute the
  // aggregate rating. Seed properties carry a baseline rating + review count;
  // any new student rating is blended into that weighted average so the
  // displayed rating "adds up" with every student.
  const addReview = (id, review) => {
    if (!review || !review.userId) return null;
    setPropertiesList(propertiesList.map(p => {
      if (String(p.id) !== String(id)) return p;

      const reviewsList = Array.isArray(p.reviewsList) ? [...p.reviewsList] : [];
      const existingIdx = reviewsList.findIndex(r => r.userId === review.userId);
      const normalized = {
        id: review.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: review.userId,
        userName: review.userName || 'Student',
        rating: Math.max(1, Math.min(5, Number(review.rating) || 0)),
        comment: review.comment ? String(review.comment).trim() : '',
        createdAt: review.createdAt || new Date().toISOString()
      };

      if (existingIdx >= 0) reviewsList[existingIdx] = normalized;
      else reviewsList.push(normalized);

      const baselineReviews = Number(p.reviews) || 0;
      const baselineRating = Number(p.rating) || 0;
      const studentSum = reviewsList.reduce((sum, r) => sum + Number(r.rating || 0), 0);
      const totalReviews = baselineReviews + reviewsList.length;
      const totalRating = totalReviews > 0
        ? (baselineRating * baselineReviews + studentSum) / totalReviews
        : 0;

      return {
        ...p,
        reviewsList,
        reviews: totalReviews,
        rating: Math.round(totalRating * 10) / 10
      };
    }));
  };

  const value = {
    propertiesList,
    getProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleVerified,
    updateInventory,
    addReview
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
