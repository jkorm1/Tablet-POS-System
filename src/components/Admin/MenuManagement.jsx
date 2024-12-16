import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "react-hot-toast";

const MenuManagement = () => {
  // State management
  const [menuItem, setMenuItem] = useState({
    food_name: '',
    price: '',
    packaging_type: '',
  });
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/menu-items?is_ordered=false');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/menu-items?is_ordered=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      // Reset form and refresh menu items
      setMenuItem({ food_name: '', price: '', packaging_type: '' });
      toast.success('Menu item added successfully!');
      fetchMenuItems();
    } catch (error) {
      setError(error.message);
      toast.error('Failed to add menu item');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/menu-items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      toast.success('Menu item deleted successfully!');
      fetchMenuItems();
    } catch (error) {
      setError(error.message);
      toast.error('Failed to delete menu item');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

      {/* Add Menu Item Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food_name">Food Name</Label>
              <Input
                id="food_name"
                value={menuItem.food_name}
                onChange={handleInputChange}
                placeholder="Enter food name"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2 pl-3">
              <Label htmlFor="price">Price (₵)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                min="0"
                value={menuItem.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
                disabled={isLoading}
                
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packaging_type">Packaging Type</Label>
              <select
                id="packaging_type"
                className="w-full border rounded-md p-2"
                value={menuItem.packaging_type}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              >
                <option value="">Select packaging type</option>
                <option value="basket">Basket</option>
                <option value="box">Box</option>
                <option value="plate">Plate</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Menu Item'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Menu Items</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        )}

        {isLoading && <div className="text-center">Loading...</div>}

        <div className="grid gap-4 md:grid-cols-2">
          {menuItems.map((item) => (
            <Card key={item.item_id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.food_name}</h3>
                    <p className="text-sm text-gray-600">₵{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Packaging: {item.packaging_type}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(item.item_id)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && menuItems.length === 0 && (
          <div className="text-center text-gray-500">
            No menu items available
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
