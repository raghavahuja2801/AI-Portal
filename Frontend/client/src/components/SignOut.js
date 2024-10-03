// src/components/Login.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
    logout();
    navigate("/login");

  return (
    <div>
      <h2>Signed out</h2>
    </div>
  );
};

export default SignOut;
