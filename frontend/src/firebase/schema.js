// Collection structure for Firestore

/*
Collections:
- users
- listings
- orders
- reviews
*/

// Example document structures
const userExample = {
  id: "string", // UID from Firebase Auth
  email: "string",
  profileImage: "string", // URL
  rating: "number",
  joinedDate: "timestamp",
  totalReviews: "number"

};

const listingExample = {
  id: "string", 
  sellerId: "string",
  title: "string",
  description: "string",
  price: "number",
  category: "string",
  condition: "string", // e.g., "Like New", "Good", etc.
  images: ["string"], // Array of image URLs
  deliveryMethod: "string", // "Shipping" or "Meetup" or both
  meetupLocation: "string", // Optional
  status: "string", // "active", "sold", "pending"
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

const orderExample = {
  id: "string", // Auto-generated
  listingId: "string", // Reference to listing.id
  buyerId: "string", // Reference to user.id
  sellerId: "string", // Reference to user.id
  status: "string", // "pending", "completed", "cancelled"
  total: "number",
  paymentType: "string", // "escrow" or "direct"
  meetupLocation: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

const reviewExample = {
  id: "string", // Auto-generated
  orderId: "string", // Reference to order.id
  reviewerId: "string", // Reference to user.id
  targetUserId: "string", // Reference to user.id being reviewed
  rating: "number", // 1-5
  comment: "string",
  createdAt: "timestamp"
}; 