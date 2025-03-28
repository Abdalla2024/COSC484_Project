// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6NXH23Sw20R0nce5uHU6u-AJo3cfP4K0",
    authDomain: "cosc484project-b0b81.firebaseapp.com",
    projectId: "cosc484project-b0b81",
    storageBucket: "cosc484project-b0b81.firebasestorage.app",
    messagingSenderId: "973006093270",
    appId: "1:973006093270:web:925ce7ebd1c1a99c01c277",
    measurementId: "G-VVFEV54R89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Configure FirebaseUI.
export const auth = getAuth(app);
