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
    return parsed.map(p =>
      p.roomTypes && p.roomTypes.length > 0
        ? p
        : { ...p, roomTypes: allInitial.find(s => s.id === p.id)?.roomTypes || [] }
    );
  });

  useEffect(() => {
    localStorage.setItem('roomigo_properties', JSON.stringify(propertiesList));
  }, [propertiesList]);

  const getProperty = (id) => propertiesList.find(p => p.id === Number(id));

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

  const value = {
    propertiesList,
    getProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleVerified,
    updateInventory
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
