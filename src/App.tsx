import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppRouter />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;