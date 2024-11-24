import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup({ username, email, password });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md rounded-lg p-6 w-full max-w-sm"
            >
                <h2 className="text-xl font-bold text-center text-white mb-4">Create an Account</h2>
                
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
                        className="shadow border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="shadow border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-white text-blue-600 hover:bg-gray-200 font-semibold py-2 rounded-md transition duration-200 ease-in-out w-full"
                >
                    Sign Up
                </button>
                <p className="text-center text-white text-sm mt-4">
                    Already have an account? 
                    <Link to="/login" className="text-yellow-300 hover:underline font-semibold ml-1">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;