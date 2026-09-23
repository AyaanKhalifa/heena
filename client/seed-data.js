import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, query, where } from "firebase/firestore";

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

const seedData = async () => {
  try {
    console.log("Seeding Settings...");
    await setDoc(doc(db, "settings", "maintenance_mode"), {
      value: "false"
    });
    console.log("Settings seeded!");

    console.log("Seeding Portfolio...");
    const portfolioCollection = collection(db, "portfolio");
    // Check if portfolio is already seeded to avoid duplicates
    const snapshot = await getDocs(portfolioCollection);
    if (snapshot.empty) {
      await addDoc(portfolioCollection, {
        title: "Traditional Bridal",
        description: "Intricate traditional bridal henna design.",
        category: "Bridal",
        image_url: "/assets/bridal_mehndi_1789986953993.jpg",
        created_at: new Date().toISOString()
      });
      await addDoc(portfolioCollection, {
        title: "Modern Elegance",
        description: "Contemporary and elegant henna pattern.",
        category: "Arabic",
        image_url: "/assets/hero_mehndi_1789986932139.jpg",
        created_at: new Date().toISOString()
      });
      console.log("Portfolio seeded!");
    } else {
      console.log("Portfolio already has data, skipping.");
    }

    console.log("Seeding Admin User...");
    try {
      const cred = await createUserWithEmailAndPassword(auth, "admin@gmail.com", "admin123");
      await setDoc(doc(db, "users", cred.user.uid), {
        name: "Admin User",
        email: "admin@gmail.com",
        phone: "0000000000",
        role: "admin",
        created_at: new Date().toISOString()
      });
      console.log("Admin account created successfully! (admin@gmail.com / admin123)");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        console.log("Admin account already exists!");
      } else {
        console.warn("Could not create admin account. Have you enabled Email/Password in Firebase console yet?", err.message);
      }
    }

    console.log("\nData seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
