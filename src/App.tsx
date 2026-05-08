import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import AIAssistant from './components/common/AIAssistant/AIAssistant';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppRouter />
      <AIAssistant />
    </AuthProvider>
  );
}

export default App;