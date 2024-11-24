import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!username.trim()) {
            errors.username = 'Username is required';
        }
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        
        if (Object.keys(errors).length === 0) {
            const success = await login({ username, password });
            if (success) {
                navigate('/');
            }
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md rounded-lg p-6 w-full max-w-sm"
            >
                <h2 className="text-xl font-bold text-center text-white mb-4">Login</h2>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={`${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.username && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                         autoComplete="new-password"
                        className={`${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-blue-600 font-semibold py-2 rounded-md transition duration-200 ease-in-out w-full"
                >
                    Login
                </button>
                <p className="text-center text-white text-sm mt-4">
                    Don't have an account? 
                    <Link to="/signup" className="text-yellow-300 hover:underline font-semibold ml-1">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
