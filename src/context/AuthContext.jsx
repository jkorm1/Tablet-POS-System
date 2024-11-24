import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuthStatus(token);
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const signup = async (userData) => {
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/signup', userData);
            
            // After successful signup, automatically log in the user
            const loginResponse = await axios.post('http://127.0.0.1:5000/auth/login', {
                username: userData.username,
                password: userData.password
            });
            
            const { token, user } = loginResponse.data;
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 