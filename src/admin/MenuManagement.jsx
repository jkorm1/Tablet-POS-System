import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        food_name: '',
        price: '',
        packaging_type: 'Regular'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/menu-items?is_ordered=false');
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/api/menu-items?is_ordered=false', {
                ...newItem,
            
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Menu item added successfully!');
            setNewItem({
                food_name: '',
                price: '',
                packaging_type: 'Regular'
            });
            fetchMenuItems();
        } catch (error) {
            setError(error.response?.data?.error || 'Error adding menu item');
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/menu-items/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Item deleted successfully!');
            fetchMenuItems();
        } catch (error) {
            setError('Error deleting item');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
            
            {/* Add New Item Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New Menu Item</h3>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Food Name
                        </label>
                        <input
                            type="text"
                            name="food_name"
                            value={newItem.food_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={newItem.price}
                            onChange={handleInputChange}
                            step="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Packaging Type
                        </label>
                        <select
                            name="packaging_type"
                            value={newItem.packaging_type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="Regular">Regular</option>
                            <option value="Large">Large</option>
                            <option value="Small">Small</option>
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Item
                    </button>
                </form>
            </div>
            
            {/* Current Menu Items */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Current Menu Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div key={item.item_id} className="border p-4 rounded-md">
                            <h4 className="font-semibold">{item.food_name}</h4>
                            <p>Price: ₵{item.price}</p>
                            <p>Packaging: {item.packaging_type}</p>
                            <button
                                onClick={() => handleDelete(item.item_id)}
                                className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;
