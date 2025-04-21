import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp 
} from 'firebase/firestore';

// Listings
export const createListing = async (listingData) => {
  try {
    const listingWithTimestamp = {
      ...listingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    };
    const docRef = await addDoc(collection(db, 'listings'), listingWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const getListing = async (listingId) => {
  try {
    const docRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting listing:', error);
    throw error;
  }
};

export const getListings = async (filters = {}, lastDoc = null, itemsPerPage = 10) => {
  try {
    let q = collection(db, 'listings');
    
    // Add filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.sellerId) {
      q = query(q, where('sellerId', '==', filters.sellerId));
    }
    
    // Add ordering and pagination
    q = query(q, 
      orderBy('createdAt', 'desc'), 
      limit(itemsPerPage)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting listings:', error);
    throw error;
  }
};

// Orders
export const createOrder = async (orderData) => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending'
    };
    const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Reviews
export const createReview = async (reviewData) => {
  try {
    const reviewWithTimestamp = {
      ...reviewData,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'reviews'), reviewWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getSellerReviews = async (sellerId, lastDoc = null, itemsPerPage = 10) => {
  try {
    let q = query(
      collection(db, 'reviews'),
      where('targetUserId', '==', sellerId),
      orderBy('createdAt', 'desc'),
      limit(itemsPerPage)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting seller reviews:', error);
    throw error;
  }
}; 