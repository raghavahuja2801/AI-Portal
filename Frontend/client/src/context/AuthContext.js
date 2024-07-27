// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser(token);
        }
    }, [token]);

    const fetchUser = async (token_data) => {
        try {
            console.log("Fetching user data from JWT")
            console.log(token_data)
            const response = await axios.get("http://192.168.29.161:5000/api/auth/me");
            setUser(response.data.user);
        } catch (error) {
            console.error(error);
        }
    };

    const login = async (email, password) => {
        try {
            console.log("Running login request")
            const response = await axios.post("http://192.168.29.161:5000/api/auth/login", { email, password });
            setToken(response.data.token);
            console.log(response.data.token)
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error(error);
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post("http://192.168.29.161:5000/api/auth/register", { name, email, password });
            console.log(response.data.token)
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        setToken('');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
