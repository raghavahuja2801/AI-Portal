// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UploadResume from './components/Upload';
import EmployerSetup from './components/EmployerSetup';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/employer" element={<EmployerSetup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
