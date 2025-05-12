import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase";
import { getStorage } from "firebase/storage"; // adjust path if needed

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
const storage = getStorage(app);

export function handleImageUpload(file) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `listings/${uuidv4()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null, // You can add progress tracking here if you want
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => resolve(url));
      }
    );
  });
} 