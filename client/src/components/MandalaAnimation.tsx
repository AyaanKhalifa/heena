import React from 'react';
import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: [0, 1, 1, 0],
      opacity: [0, 1, 1, 0],
      transition: {
        pathLength: { delay, duration: 6, ease: "easeInOut", repeat: Infinity },
        opacity: { delay, duration: 6, ease: "easeInOut", repeat: Infinity }
      }
    };
  }
};

const MandalaAnimation: React.FC = () => {
  return (
    <section style={{ padding: '80px 20px', backgroundColor: 'var(--color-henna-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ color: 'var(--color-gold)', fontSize: '2.5rem', marginBottom: '2rem' }}
        >
          The Art of Precision
        </motion.h2>
        
        <div style={{ width: '250px', height: '250px', margin: '0 auto' }}>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Center Circle */}
            <motion.circle cx="100" cy="100" r="10" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={0} />
            <motion.circle cx="100" cy="100" r="15" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="3 3" fill="none" variants={draw} custom={0.5} />
            
            {/* Inner Petals */}
            <motion.path d="M 100 85 C 105 70, 115 70, 115 85 C 115 95, 105 100, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={1} />
            <motion.path d="M 100 85 C 95 70, 85 70, 85 85 C 85 95, 95 100, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={1} />
            <motion.path d="M 115 100 C 130 95, 130 105, 115 115 C 105 115, 100 105, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={1.5} />
            <motion.path d="M 85 100 C 70 95, 70 105, 85 115 C 95 115, 100 105, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={1.5} />
            <motion.path d="M 100 115 C 105 130, 115 130, 115 115 C 115 105, 105 100, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={2} />
            <motion.path d="M 100 115 C 95 130, 85 130, 85 115 C 85 105, 95 100, 100 100" stroke="var(--color-gold)" strokeWidth="1.5" fill="none" variants={draw} custom={2} />

            {/* Outer Lotus Petals */}
            <motion.path d="M 100 65 C 120 40, 140 60, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={2.5} />
            <motion.path d="M 100 65 C 80 40, 60 60, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={2.5} />
            <motion.path d="M 135 100 C 160 80, 140 120, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={3} />
            <motion.path d="M 65 100 C 40 80, 60 120, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={3} />
            <motion.path d="M 100 135 C 120 160, 140 140, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={3.5} />
            <motion.path d="M 100 135 C 80 160, 60 140, 100 100" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={3.5} />
            
            {/* Outer Ring */}
            <motion.circle cx="100" cy="100" r="75" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="5 5" fill="none" variants={draw} custom={4} />
            <motion.circle cx="100" cy="100" r="85" stroke="var(--color-gold)" strokeWidth="2" fill="none" variants={draw} custom={4.5} />
            
            {/* Decorative Dots */}
            <motion.circle cx="100" cy="10" r="3" fill="var(--color-gold)" variants={draw} custom={5} />
            <motion.circle cx="100" cy="190" r="3" fill="var(--color-gold)" variants={draw} custom={5} />
            <motion.circle cx="10" cy="100" r="3" fill="var(--color-gold)" variants={draw} custom={5.5} />
            <motion.circle cx="190" cy="100" r="3" fill="var(--color-gold)" variants={draw} custom={5.5} />
          </motion.svg>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 3.5 }}
          style={{ color: 'var(--color-cream)', marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0', fontSize: '1.2rem', fontStyle: 'italic' }}
        >
          Every design is intricately crafted by hand, combining traditional motifs with modern aesthetics.
        </motion.p>
      </div>
    </section>
  );
};

export default MandalaAnimation;
