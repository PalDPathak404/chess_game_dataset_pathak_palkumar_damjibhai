import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GlobalLayout from './layouts/GlobalLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import { Home, NotFound } from './pages';
import { Login, Register } from './pages/auth';
import { Workspace } from './pages/workspace';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Routes */}
          <Route path="/" element={<GlobalLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Workspace Routes */}
          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Workspace />} />
            {/* Future nested routes will go here (reviews, games, etc) */}
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<GlobalLayout />} >
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;