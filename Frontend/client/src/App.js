// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UploadResume from './components/Upload';
import EmployerSetup from './components/EmployerSetup';
import UserProfileSetup from './components/UserProfile';
import SignOut from './components/SignOut';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/profile' element={<UserProfileSetup/>} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/employer" element={<EmployerSetup />} />
          <Route path="/signout" element={<SignOut />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
