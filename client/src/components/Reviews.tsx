import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: "Priya M.",
    role: "Bride",
    text: "Amira is a true artist! My bridal mehndi was exactly what I envisioned. The stain was incredibly dark and lasted for weeks. Highly professional and so sweet!",
    rating: 5
  },
  {
    name: "Sarah K.",
    role: "Bridesmaid",
    text: "She did the mehndi for our entire bridal party. Fast, neat, and absolutely beautiful designs. Everyone loved their henna!",
    rating: 5
  },
  {
    name: "Ayesha R.",
    role: "Festival Client",
    text: "I always book her for Eid. Her organic henna smells amazing and I love that it's chemical-free. The designs are modern and chic.",
    rating: 5
  }
];

// SVG star instead of emoji
const Star: React.FC = () => (
  <svg viewBox="0 0 20 20" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '3px' }}>
    <path d="M10 1l2.5 6.5H19l-5.3 4 2 6.5L10 14l-5.7 4 2-6.5L1 7.5h6.5z" fill="var(--color-gold)" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
};

const Reviews: React.FC = () => {
  return (
    <section style={{ padding: '100px 20px', backgroundColor: '#fff' }}>
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-henna-dark)' }}
        >
          Client Love
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '4rem', color: '#666', fontSize: '1.2rem' }}
        >
          Read what our beautiful brides and clients have to say.
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants} 
              whileHover={{ y: -10 }} 
              style={{ backgroundColor: 'var(--color-cream)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}
            >
              <div style={{ marginBottom: '1rem', lineHeight: '1', display: 'flex', alignItems: 'center' }}>
                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} />)}
              </div>
              <p style={{ color: '#444', fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                "{review.text}"
              </p>
              <div>
                <h4 style={{ color: 'var(--color-henna-rich)', margin: 0, fontSize: '1.2rem' }}>{review.name}</h4>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>{review.role}</span>
              </div>
              {/* Decorative SVG quote mark */}
              <svg viewBox="0 0 40 40" style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', opacity: 0.08 }}>
                <path d="M8 24c0-5 4-9 9-13l2 2c-4 3-5 6-5 8 2 0 4 2 4 4s-2 5-5 5-5-3-5-6zm15 0c0-5 4-9 9-13l2 2c-4 3-5 6-5 8 2 0 4 2 4 4s-2 5-5 5-5-3-5-6z" fill="var(--color-henna-dark)" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
