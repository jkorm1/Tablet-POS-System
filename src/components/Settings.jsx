import React, { useState } from 'react';
import { Sun, Moon, Globe, DollarSign, Lock, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleThemeChange = (e) => setTheme(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleCurrencyChange = (e) => setCurrency(e.target.value);

  const handleSaveSettings = () => {
    console.log('Settings saved:', { theme, language, currency });
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    setTheme('light');
    setLanguage('English');
    setCurrency('USD');
    setOldPassword('');
    setNewPassword('');
    alert('Settings reset to default!');
  };

  const handleChangePassword = () => {
    if (oldPassword && newPassword) {
      // Implement password change logic here
      console.log('Password changed:', { oldPassword, newPassword });
      alert('Password changed successfully!');
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 flex items-center">
        <SettingsIcon className="w-8 h-8 mr-2" />
        Settings
      </h1>
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-md shadow-sm border-b border-gray-200">
          {theme === 'light' ? <Sun className="w-6 h-6 text-gray-500" /> : <Moon className="w-6 h-6 text-gray-500" />}
          <div className="flex-grow">
            <label className="block text-gray-700 font-semibold mb-1">Theme</label>
            <select value={theme} onChange={handleThemeChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-white rounded-md shadow-sm border-b border-gray-200">
          <Globe className="w-6 h-6 text-gray-500" />
          <div className="flex-grow">
            <label className="block text-gray-700 font-semibold mb-1">Language</label>
            <select value={language} onChange={handleLanguageChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              {/* Add more languages as needed */}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-white rounded-md shadow-sm border-b border-gray-200">
          <DollarSign className="w-6 h-6 text-gray-500" />
          <div className="flex-grow">
            <label className="block text-gray-700 font-semibold mb-1">Currency</label>
            <select value={currency} onChange={handleCurrencyChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-white rounded-md shadow-sm border-b border-gray-200">
          <Lock className="w-6 h-6 text-gray-500" />
          <div className="flex-grow">
            <label className="block text-gray-700 font-semibold mb-1">Change Password</label>
            <input 
              type="password" 
              placeholder="Old Password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button 
              onClick={handleChangePassword} 
              className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded shadow-lg transition duration-200 transform hover:scale-105"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-8">
        <button onClick={handleSaveSettings} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow-lg transition duration-200 transform hover:scale-105">
          Save
        </button>
        <button onClick={handleResetSettings} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded shadow-lg transition duration-200 transform hover:scale-105">
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
