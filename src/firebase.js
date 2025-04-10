import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6NXH23Sw20R0nce5uHU6u-AJo3cfP4K0",
  authDomain: "cosc484project-b0b81.firebaseapp.com",
  projectId: "cosc484project-b0b81",
  storageBucket: "cosc484project-b0b81.appspot.com",
  messagingSenderId: "973006093270",
  appId: "1:973006093270:web:925ce7ebd1c1a99c01c277",
  measurementId: "G-VVFEV54R89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

console.log("Firebase initialized with config:", {
  projectId: firebaseConfig.projectId,
  databaseInitialized: !!db
});

export { db }; 