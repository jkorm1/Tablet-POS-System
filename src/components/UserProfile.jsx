import React, { useContext } from 'react';
import Database from './database';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = ({ onLogout, calculateSwipesPerHour, cardStatus }) => {
    const { cards, loading } = useContext(Database);
    const user = {
        name: "Solomon Attipoe",
        role: "Salesperson",
        email: "solomonattipoemensah@gmail.com",
        phone: "+233543316245",
    };

    const completedCards = cards.filter(card => cardStatus[card.user_id] === 'Completed');
    const totalSales = completedCards.reduce((sum, card) => {
        return sum + Object.keys(card.containers).reduce((containerTotal, containerId) => {
            return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                return itemTotal + parseFloat(item.Price);
            }, 0);
        }, 0);
    }, 0).toFixed(2);

    const totalOrders = completedCards.reduce((sum, card) => sum + Object.keys(card.containers).length, 0);
    const averageSale = (totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0);

    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-center mb-4 space-y-2">
                <Avatar className="w-24 h-24">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ATI</AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-500">{user.role}</p>
                <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                <p className="text-gray-700 dark:text-gray-300">{user.phone}</p>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Sales Performance</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p>Total Sales: <span className="font-medium text-gray-900 dark:text-white">${totalSales}</span></p>
                    <p>Average Sale: <span className="font-medium text-gray-900 dark:text-white">${averageSale}</span></p>
                    <p className="text-blue-500"><em>Swipes/hour: <span className="font-medium">{calculateSwipesPerHour()}</span></em></p>
                </>
            )}

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Account Settings</h3>
            <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Change Password</a></li>
                <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Manage Payment Methods</a></li>
                <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Notification Preferences</a></li>
            </ul>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Help & Support</h3>
            <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Help Center</a></li>
                <li><a href="#" className="text-blue-500 hover:underline dark:text-blue-400">Contact Support</a></li>
            </ul>

            <div className="flex justify-center">
                <button onClick={handleLogout} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 ease-in-out">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
