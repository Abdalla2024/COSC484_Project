// src/auth/firebaseconfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyA6NXH23Sw20R0nce5uHU6u-AJo3cfP4K0",
  authDomain: "cosc484project-b0b81.firebaseapp.com",
  projectId: "cosc484project-b0b81",
  storageBucket: "cosc484project-b0b81.appspot.com",
  messagingSenderId: "973006093270",
  appId: "1:973006093270:web:925ce7ebd1c1a99c01c277",
  measurementId: "G-VVFEV54R89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export async function handleImageUpload(file) {
  const storageRef = ref(storage, `listings/${uuidv4()}-${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export { auth, db, storage };
