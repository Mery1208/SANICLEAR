import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      background: '#1f2937',
      color: '#9ca3af',
      fontSize: '0.9rem',
      marginTop: 'auto'
    }}>
      <p>© 2025 Saniclear - Gestión Hospitalaria Inteligente</p>
      <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Proyecto TFG - 2º DAW</p>
    </footer>
  );
};

export default Footer;