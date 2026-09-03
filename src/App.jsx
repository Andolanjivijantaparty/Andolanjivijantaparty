import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
