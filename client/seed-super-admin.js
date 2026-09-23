import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg2lEvpoquPVyQp0b1X19AsFl08Zm7dYg",
  authDomain: "heena-69.firebaseapp.com",
  projectId: "heena-69",
  storageBucket: "heena-69.firebasestorage.app",
  messagingSenderId: "44224419294",
  appId: "1:44224419294:web:c3d43c938b74a132aa794f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const seedSuperAdmin = async () => {
  try {
    console.log("Logging in as admin@gmail.com...");
    const cred = await signInWithEmailAndPassword(auth, "admin@gmail.com", "admin123");
    
    console.log("Elevating user to super_admin...");
    await updateDoc(doc(db, "users", cred.user.uid), {
      role: "super_admin"
    });
    
    const verifyDoc = await getDoc(doc(db, "users", cred.user.uid));
    console.log("Verification - Current role:", verifyDoc.data().role);
    
    console.log("\nSuccess! admin@gmail.com is now a super_admin.");
    console.log("Log out and log back in to see the super_admin privileges.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to set super_admin:", err);
    process.exit(1);
  }
};

seedSuperAdmin();
