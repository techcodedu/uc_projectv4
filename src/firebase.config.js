// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9FaQYM2-lEC-AsIdcCTlEdaIehKRXlZ0",
  authDomain: "irish-project-39113.firebaseapp.com",
  projectId: "irish-project-39113",
  storageBucket: "irish-project-39113.appspot.com",
  messagingSenderId: "453138132888",
  appId: "1:453138132888:web:2fe695949efb72280585ed",
  measurementId: "G-GWCTV0QQBC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
