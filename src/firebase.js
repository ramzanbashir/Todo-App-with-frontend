// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_T3FJL_vzNWGHIKHOgNdsHKwTfck48To",
  authDomain: "todo-1f912.firebaseapp.com",
  projectId: "todo-1f912",
  storageBucket: "todo-1f912.firebasestorage.app",
  messagingSenderId: "372572628621",
  appId: "1:372572628621:web:31c8db6ec5bd1c660e64c4",
  measurementId: "G-KQD1403FB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
