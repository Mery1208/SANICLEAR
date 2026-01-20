import React from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Panel de Control</h1>
        <p>Bienvenido al sistema interno.</p>
      </div>
    </div>
  );
}