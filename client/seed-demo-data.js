import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

const demoServices = [
  {
    title: "Bridal Full Package",
    description: "Extensive bridal mehndi covering full arms to elbows and full legs to knees.",
    price: "₹5,000",
    features: ["Intricate traditional designs", "Custom portraits", "Bridal figures", "Organic paste guaranteed"]
  },
  {
    title: "Bridal Classic",
    description: "Beautiful classic bridal mehndi for hands up to mid-arms and feet.",
    price: "₹3,500",
    features: ["Classic mandalas", "Floral patterns", "Peacock motifs", "Includes consultation"]
  },
  {
    title: "Festival Special",
    description: "Perfect for Eid, Diwali, or Karwa Chauth. Front and back of hands.",
    price: "₹1,500",
    features: ["Quick application", "Dense Arabic patterns", "Long-lasting dark stain"]
  },
  {
    title: "Party Wear Mehndi",
    description: "Light, elegant, and modern designs for wedding guests and parties.",
    price: "₹500",
    features: ["Minimalist vines", "Geometric shapes", "Jewelry style designs"]
  }
];

const demoPortfolio = [
  {
    title: "Royal Bridal Hands",
    description: "Intricate bridal mehndi featuring Raja-Rani motifs.",
    image_url: "https://images.unsplash.com/photo-1590494491745-97f26c714d23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Modern Minimalist",
    description: "A simple yet elegant Arabic design for a party.",
    image_url: "https://images.unsplash.com/photo-1510006900650-70f90c3d9a0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Floral Feet Design",
    description: "Detailed floral and vine patterns for bridal feet.",
    image_url: "https://images.unsplash.com/photo-1618641986557-1ec236618cce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Traditional Mandala",
    description: "A classic center mandala surrounded by intricate details.",
    image_url: "https://images.unsplash.com/photo-1618395568541-118c8e096f1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Karwa Chauth Special",
    description: "Festive design focusing on full palm coverage.",
    image_url: "https://images.unsplash.com/photo-1583091010313-08638977c082?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const demoBookings = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    date: "2026-10-15",
    services: "Bridal Full Package",
    message: "I would like a customized Raja-Rani design on my forearms. Please contact me for details.",
    status: "approved"
  },
  {
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    phone: "+91 91234 56789",
    date: "2026-10-20",
    services: "Festival Special",
    message: "Need quick mehndi for Karwa Chauth for me and my sister.",
    status: "pending"
  },
  {
    name: "Riya Verma",
    email: "riya.v@example.com",
    phone: "+91 99887 76655",
    date: "2026-11-05",
    services: "Party Wear Mehndi",
    message: "Minimalist Arabic design on the back of the hands only.",
    status: "rejected"
  }
];

const demoUsers = [
  {
    id: "demo_user_1",
    name: "Anjali Gupta",
    email: "anjali@example.com",
    role: "user"
  },
  {
    id: "demo_user_2",
    name: "Neha Desai",
    email: "neha.d@example.com",
    role: "user"
  }
];

const seedDemoData = async () => {
  try {
    console.log("Seeding demo services...");
    for (const service of demoServices) {
      const docRef = doc(collection(db, "services"));
      await setDoc(docRef, { ...service, created_at: new Date().toISOString() });
      console.log(`Added service: ${service.title}`);
    }

    console.log("\nSeeding demo portfolio items...");
    for (const item of demoPortfolio) {
      const docRef = doc(collection(db, "portfolio"));
      await setDoc(docRef, { ...item, created_at: new Date().toISOString() });
      console.log(`Added portfolio item: ${item.title}`);
    }

    console.log("\nSeeding demo bookings...");
    for (const booking of demoBookings) {
      const docRef = doc(collection(db, "bookings"));
      await setDoc(docRef, { ...booking, created_at: new Date().toISOString() });
      console.log(`Added booking from: ${booking.name}`);
    }

    console.log("\nSeeding demo users...");
    for (const user of demoUsers) {
      const docRef = doc(db, "users", user.id);
      await setDoc(docRef, { name: user.name, email: user.email, role: user.role, created_at: new Date().toISOString() });
      console.log(`Added user: ${user.name}`);
    }

    console.log("\nSuccess! Demo data seeded.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed data:", err);
    process.exit(1);
  }
};

seedDemoData();
