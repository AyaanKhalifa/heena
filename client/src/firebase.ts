// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg2lEvpoquPVyQp0b1X19AsFl08Zm7dYg",
  authDomain: "heena-69.firebaseapp.com",
  projectId: "heena-69",
  storageBucket: "heena-69.firebasestorage.app",
  messagingSenderId: "44224419294",
  appId: "1:44224419294:web:c3d43c938b74a132aa794f",
  measurementId: "G-8EXH748WNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics not supported or blocked", e);
}

export { analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
