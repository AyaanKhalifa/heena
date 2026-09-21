import React, { useState, useEffect, useRef } from 'react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<string>('');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('Thank you! Your booking inquiry has been received.');
      } else {
        setStatus('Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      setStatus('Failed to connect to the server.');
    }
  };

  return (
    <section id="contact" style={{ backgroundColor: '#fff' }}>
      <div className="container reveal" ref={sectionRef}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Book a Consultation</h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>Let's discuss your design requirements and event date.</p>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <input type="text" name="name" placeholder="Full Name" required 
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-body)' }} />
            
          <input type="email" name="email" placeholder="Email Address" required 
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-body)' }} />
            
          <input type="date" name="date" required 
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-body)' }} />
            
          <select name="services" required style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-body)', backgroundColor: '#fff' }}>
            <option value="">Select Service</option>
            <option value="Bridal">Bridal Mehndi</option>
            <option value="Party">Party / Guest Mehndi</option>
            <option value="Festival">Festival Mehndi</option>
          </select>

          <textarea name="message" placeholder="Tell us more about your event..." rows={4} required 
            style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'var(--font-body)', resize: 'vertical' }}></textarea>
            
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Inquiry</button>
          
          {status && <p style={{ textAlign: 'center', color: 'var(--color-henna-rich)', fontWeight: 'bold' }}>{status}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;
