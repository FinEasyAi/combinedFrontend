import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Login from './Login';
import Signup from './Signup';
import './App.css';

// Private Route Wrapper
// Private Route Wrapper
import { authService } from './services/authService';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => { }} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <div className="app-container fade-in">
              {/* Background Visuals */}
              <div className="bg-visuals">
                <div className="blur-shape shape-1"></div>
                <div className="blur-shape shape-2"></div>
              </div>

              <Sidebar />
              <MainContent />
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
