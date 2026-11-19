// useProperty hook — developed by Prince Korankye Akonno
import { useContext } from 'react';
import { PropertyContext } from './property-context';

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
