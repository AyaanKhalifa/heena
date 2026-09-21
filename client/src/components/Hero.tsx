import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('active');
    }
  }, []);

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(62, 30, 28, 0.7), rgba(62, 30, 28, 0.7)), url(/assets/hero_mehndi_1789986932139.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'var(--color-cream)',
      textAlign: 'center',
      paddingTop: '80px'
    }}>
      <div className="container reveal" ref={heroRef}>
        <h1 style={{ color: 'var(--color-gold)', fontSize: '4rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Bespoke Heena Artistry</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Exquisite, personalized mehndi for your special moments. Crafted with 100% natural, organic heena.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#portfolio" className="btn-primary">View Portfolio</a>
          <a href="#contact" className="btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>Book a Consultation</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
