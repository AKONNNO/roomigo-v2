// Additional mock properties — authored by Prince Korankye Akonno
// Additional mock properties

export const additionalProperties = [
  {
    id: 4,
    name: "Bedu House",
    address: "Kumasi, Kentinkrono",
    distance: "1.5 km",
    price: 1500,
    priceType: "per semester",
    rooms: 12,
    availableRooms: 3,
    roomTypes: [3, 4],
    roomPrices: { 3: 1500, 4: 1200 },
    gender: "Mixed",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
    ],
    amenities: ["WiFi", "Security", "Kitchen"],
    description: "Affordable and cozy accommodation for budget-conscious students. Basic but comfortable rooms with essential amenities. Great value for money.",
    manager: { name: "Mr. Kofi Amponsah", phone: "+233 55 234 5678", email: "kamponsah@beduhouse.com" },
    verified: false,
    rating: 3.8,
    reviews: 18
  },
  {
    id: 5,
    name: "Royal Oak Residences",
    address: "Kumasi, Ahodwo",
    distance: "3.0 km",
    price: 4000,
    priceType: "per semester",
    rooms: 30,
    availableRooms: 10,
    roomTypes: [1, 2],
    roomPrices: { 1: 6000, 2: 4000 },
    gender: "Mixed",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ],
    amenities: ["WiFi", "24/7 Security", "Kitchen", "Laundry", "Gym", "Swimming Pool", "Parking", "Study Room", "AC"],
    description: "Luxury student accommodation with premium amenities including a swimming pool and air-conditioned rooms. The ultimate off-campus living experience.",
    manager: { name: "Mrs. Efua Darko", phone: "+233 26 345 6789", email: "efua@royaloak.gh" },
    verified: true,
    rating: 4.9,
    reviews: 56
  },
  {
    id: 6,
    name: "Unity Hostel",
    address: "Kumasi, Ayigya",
    distance: "1.8 km",
    price: 2000,
    priceType: "per semester",
    rooms: 20,
    availableRooms: 7,
    roomTypes: [2, 3, 4],
    roomPrices: { 2: 2000, 3: 1600, 4: 1400 },
    gender: "Female Only",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1560184897-a75a9511b533?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    amenities: ["WiFi", "Security", "Kitchen", "Laundry", "Study Room"],
    description: "Popular female-only hostel with a strong community feel. Regular social events and a supportive environment make it easy to make friends.",
    manager: { name: "Ms. Abena Wiredu", phone: "+233 54 876 5432", email: "abena@unityhostel.com" },
    verified: true,
    rating: 4.3,
    reviews: 41
  }
];

export const locations = ["All Locations", "Near KNUST Main Gate", "Ayigya Town", "Boadi", "Kentinkrono", "Ahodwo"];
export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under GHS 2,000", min: 0, max: 2000 },
  { label: "GHS 2,000 - 3,000", min: 2000, max: 3000 },
  { label: "GHS 3,000 - 4,000", min: 3000, max: 4000 },
  { label: "Over GHS 4,000", min: 4000, max: Infinity }
];
export const genderOptions = ["All", "Mixed", "Male Only", "Female Only"];
export const amenityOptions = ["WiFi", "24/7 Security", "Kitchen", "Laundry", "Gym", "Cafeteria", "Parking", "Study Room", "AC", "Common Room"];

// Room configurations offered by a hostel (people per room)
export const roomTypeOptions = [
  { value: 1, label: '1 in a Room' },
  { value: 2, label: '2 in a Room' },
  { value: 3, label: '3 in a Room' },
  { value: 4, label: '4 in a Room' }
];
