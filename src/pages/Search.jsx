import { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';
import { useProperty } from '../context/useProperty';
import './Search.css';

const Search = () => {
  const { propertiesList } = useProperty();
  const [searchParams] = useSearchParams();

  // Read footer links' query params: ?gender=female|male and ?budget=2000
  const genderParam = searchParams.get('gender');
  const budgetParam = searchParams.get('budget');

  const initialGender = genderParam === 'female'
    ? 'Female Only'
    : genderParam === 'male'
      ? 'Male Only'
      : 'All';
  const initialPriceMax = budgetParam ? parseInt(budgetParam, 10) : Infinity;

  const [filters, setFilters] = useState({
    location: 'All Locations',
    priceMin: 0,
    priceMax: initialPriceMax,
    gender: initialGender,
    amenities: [],
    roomTypes: [],
    search: ''
  });

  // Re-apply footer filters when the URL query changes while Search is already open
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      gender: initialGender,
      priceMin: 0,
      priceMax: initialPriceMax
    }));
  }, [genderParam, budgetParam]);

  const allProperties = propertiesList;

  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Search text filter
      if (filters.search && !property.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !property.address.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location !== 'All Locations' && !property.address.includes(filters.location)) {
        return false;
      }

      // Price filter
      if (property.price < filters.priceMin || property.price > filters.priceMax) {
        return false;
      }

      // Gender filter
      if (filters.gender !== 'All' && property.gender !== filters.gender) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Room type filter (property must offer every selected configuration)
      if (filters.roomTypes.length > 0) {
        const available = property.roomTypes || [];
        const hasAllRoomTypes = filters.roomTypes.every(rt => available.includes(rt));
        if (!hasAllRoomTypes) return false;
      }

      return true;
    });
  }, [filters, allProperties]);

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="container">
          <h1>Find Your Perfect Hostel</h1>
          <div className="search-bar">
            <SearchIcon size={20} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="search-content">
        <div className="container">
          <div className="search-layout">
            <aside className="filters-sidebar">
              <SearchFilters filters={filters} setFilters={setFilters} />
            </aside>

            <main className="results">
              <div className="results-header">
                <p className="results-count">
                  Found <strong>{filteredProperties.length}</strong> hostels
                </p>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="properties-grid">
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <h3>No hostels found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
