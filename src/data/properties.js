// Mock data for hostel/property listings — authored by Prince Korankye Akonno
// Mock data for hostel/property listings around KNUST campus

export const properties = [
  {
    id: 1,
    name: "Kumasi Heights Hostel",
    address: "Kumasi, Near KNUST Main Gate",
    distance: "0.5 km",
    price: 2500,
    priceType: "per semester",
    rooms: 24,
    availableRooms: 8,
    roomTypes: [1, 2, 3],
    roomPrices: { 1: 4000, 2: 3000, 3: 2500 },
    gender: "Mixed",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    amenities: ["WiFi", "24/7 Security", "Kitchen", "Laundry", "Common Room", "Parking"],
    description: "Modern hostel conveniently located just 5 minutes from KNUST main gate. Features spacious rooms with modern furnishings, round-the-clock security, and a vibrant student community.",
    manager: { name: "Mr. Kwame Asare", phone: "+233 24 123 4567", email: "kasare@hostels.com" },
    verified: true,
    rating: 4.5,
    reviews: 45
  },
  {
    id: 2,
    name: "Campus View Lodge",
    address: "Kumasi, Ayigya Town",
    distance: "1.2 km",
    price: 1800,
    priceType: "per semester",
    rooms: 16,
    availableRooms: 5,
    roomTypes: [2, 4],
    roomPrices: { 2: 1800, 4: 1500 },
    gender: "Female Only",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
    ],
    amenities: ["WiFi", "Security", "Kitchen", "Study Room"],
    description: "Safe and quiet accommodation specifically for female students. Located in the peaceful Ayigya neighborhood with easy access to campus and local amenities.",
    manager: { name: "Mrs. Akosua Mensah", phone: "+233 24 987 6543", email: "akosua@campusview.com" },
    verified: true,
    rating: 4.2,
    reviews: 32
  },
  {
    id: 3,
    name: "Student Haven Complex",
    address: "Kumasi, Boadi",
    distance: "2.0 km",
    price: 3200,
    priceType: "per semester",
    rooms: 40,
    availableRooms: 12,
    roomTypes: [1, 2, 3, 4],
    roomPrices: { 1: 4500, 2: 3500, 3: 3200, 4: 2800 },
    gender: "Male Only",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800"
    ],
    amenities: ["WiFi", "24/7 Security", "Kitchen", "Laundry", "Gym", "Cafeteria", "Parking", "Study Room"],
    description: "Premium student accommodation with top-tier facilities. Features a fully equipped gym, on-site cafeteria, and dedicated study rooms. Perfect for serious students.",
    manager: { name: "Mr. Yaw Oppong", phone: "+233 20 456 7890", email: "yoppong@studenthaven.gh" },
    verified: true,
    rating: 4.8,
    reviews: 89
  }
];

export default properties;
