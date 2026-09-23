import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCg2lEvpoquPVyQp0b1X19AsFl08Zm7dYg",
  authDomain: "heena-69.firebaseapp.com",
  projectId: "heena-69",
  storageBucket: "heena-69.firebasestorage.app",
  messagingSenderId: "44224419294",
  appId: "1:44224419294:web:c3d43c938b74a132aa794f",
  measurementId: "G-8EXH748WNH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const d = await getDoc(doc(db, 'settings', 'maintenance_mode'));
    console.log("SUCCESS! Rules are public. Value:", d.data());
  } catch(e) {
    console.log("FAILED! Rules block public read. Error:", e.message);
  }
  process.exit(0);
}

test();
