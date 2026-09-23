import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

const seedAdmin = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, "admin@gmail.com", "admin123");
    await setDoc(doc(db, "users", cred.user.uid), {
      name: "Admin User",
      email: "admin@gmail.com",
      phone: "0000000000",
      role: "admin",
      created_at: new Date().toISOString()
    });
    console.log("Admin account created successfully!");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log("Admin account already exists!");
      console.log("Email: admin@gmail.com");
      console.log("Password: admin123");
      process.exit(0);
    } else {
      console.error("Error creating admin:", err);
      process.exit(1);
    }
  }
};

seedAdmin();
