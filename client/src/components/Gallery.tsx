import React, { useEffect, useRef } from 'react';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="portfolio" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="container reveal" ref={sectionRef}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Portfolio</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <img 
              src="/assets/bridal_mehndi_1789986953993.jpg" 
              alt="Bridal Mehndi" 
              style={{ width: '100%', height: '350px', objectFit: 'cover', transition: 'var(--transition-slow)' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{ padding: '1.5rem', backgroundColor: '#fff', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-henna-rich)' }}>Bridal Elegance</h3>
              <p style={{ color: '#666' }}>Intricate traditional designs for your big day.</p>
            </div>
          </div>
          
          <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <img 
              src="/assets/hero_mehndi_1789986932139.jpg" 
              alt="Party Mehndi" 
              style={{ width: '100%', height: '350px', objectFit: 'cover', transition: 'var(--transition-slow)' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{ padding: '1.5rem', backgroundColor: '#fff', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-henna-rich)' }}>Modern & Party</h3>
              <p style={{ color: '#666' }}>Elegant contemporary patterns for guests.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Gallery;
