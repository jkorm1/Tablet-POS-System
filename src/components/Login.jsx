import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            onLogin({ username, password });
            setUsername('');
            setPassword('');
        } else {
            console.log('Please enter both username and password.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100"> {/* Normal background */}
            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md rounded-lg p-6 w-full max-w-sm" // Colorful background
            >
                <h2 className="text-xl font-bold text-center text-white mb-4">Login</h2> {/* Changed text color to white */}
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Username</label> {/* Changed label color to white */}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="shadow border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-1">Password</label> {/* Changed label color to white */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-blue-600 font-semibold py-2 rounded-md transition duration-200 ease-in-out w-full"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
