import React, { useContext, useState, useEffect } from 'react';
import Database from './database';

const OrderHistory = ({ cardStatus }) => {
    const { cards, loading } = useContext(Database);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [filteredCards, setFilteredCards] = useState([]);

    useEffect(() => {
        if (!loading) {
            let amount = 0;
            let orders = 0;
            const uniqueIds = new Set();

            const completedOrders = cards.filter(card => cardStatus[card.user_id] === 'Completed');
            completedOrders.forEach(card => {
                const cardAmount = Object.keys(card.containers).reduce((containerTotal, containerId) => {
                    return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                        return itemTotal + parseFloat(item.Price);
                    }, 0);
                }, 0).toFixed(2);

                amount += parseFloat(cardAmount);
                orders += Object.keys(card.containers).length || 0;
                uniqueIds.add(card.user_id);

                card.numberOfOrders = Object.keys(card.containers).length;
                card.amount = `$${cardAmount}`;
            });

            setTotalAmount(amount);
            setTotalOrders(orders);
            setTotalCustomers(uniqueIds.size);
            setFilteredCards(completedOrders);
        }
    }, [cards, loading, cardStatus]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const displayedCards = filteredCards.filter((card) => {
        const term = searchTerm.toLowerCase();
        return (
            card.user_id.toLowerCase().includes(term) ||
            card.location.toLowerCase().includes(term) ||
            card.order_type.toLowerCase().includes(term)
        );
    });

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Order History</h2>
            <div className="summary mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Order Summary</h3>
                <p className="text-blue-700 dark:text-blue-300">Total Customers: <span className="font-bold">{totalCustomers}</span></p>
                <p className="text-blue-700 dark:text-blue-300">Total Orders: <span className="font-bold">{totalOrders}</span></p>
                <p className="text-blue-700 dark:text-blue-300">Total Amount: <span className="font-bold">${totalAmount.toFixed(2)}</span></p>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Search by User ID, Location, or Order Type"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : displayedCards.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No completed orders found.</p>
            ) : (
                displayedCards.map((card) => (
                    <div key={card.user_id} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User ID: {card.user_id}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{card.order_type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <p><span className="font-semibold">Number of Containers:</span> {card.numberOfOrders}</p>
                                <p><span className="font-semibold">Amount:</span> {card.amount}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Location:</span> {card.location}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
