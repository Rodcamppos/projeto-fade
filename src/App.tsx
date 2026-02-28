import React, { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Eventos } from './pages/Eventos';
import { Participantes } from './pages/Participantes';
import { ConfiguracaoCheckin } from './pages/ConfiguracaoCheckin';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-blue-600 font-medium">
        Carregando...
      </div>
    );
  }
  
  return authenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  console.log("React carregado:", React.version);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/eventos" element={
            <PrivateRoute>
              <Eventos />
            </PrivateRoute>
          } />
          
          <Route path="/participantes" element={
            <PrivateRoute>
              <Participantes />
            </PrivateRoute>
          } />
          
          <Route path="/eventos/:id/configuracao" element={
            <PrivateRoute>
              <ConfiguracaoCheckin />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;