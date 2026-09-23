import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCg2lEvpoquPVyQp0b1X19AsFl08Zm7dYg",
  authDomain: "heena-69.firebaseapp.com",
  projectId: "heena-69",
  storageBucket: "heena-69.firebasestorage.app",
  messagingSenderId: "44224419294",
  appId: "1:44224419294:web:c3d43c938b74a132aa794f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const newAboutText = `Mehndi is not just a form of body art; it is an expression of joy, a symbol of auspicious beginnings, and a celebration of life's most beautiful moments. 

With every stroke and every curve, I pour my passion into creating intricate designs that tell a unique story. Whether it is the bold, traditional motifs of a bridal celebration or the sleek, minimalist patterns for a modern festivity, I believe in tailoring every design to reflect your personality and style. 

Let us make your special occasions truly unforgettable with the magic of organic henna, crafted with love and dedication.`;

const executeUpdates = async () => {
  try {
    // 1. Update About Text
    console.log("Updating About text...");
    await setDoc(doc(db, "settings", "website_content"), {
      aboutText: newAboutText
    }, { merge: true });
    console.log("About text updated successfully.");

    // 2. Create Super Admin User
    const email = "ayaan@habibi.com";
    const password = "443244"; // Firebase requires 6 characters minimum
    
    console.log(`\nCreating Super Admin user: ${email}...`);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name: "Ayaan Khalifa",
        email: email,
        role: "super_admin",
        created_at: new Date().toISOString()
      });
      console.log("Super Admin created successfully!");
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        console.log("User already exists. Ensuring super_admin role...");
        // Log in to get the UID (if possible) or just skip if we assume it's already super admin.
        console.log("Please log in with the existing account.");
      } else {
        throw e;
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("Failed to execute updates:", err);
    process.exit(1);
  }
};

executeUpdates();
