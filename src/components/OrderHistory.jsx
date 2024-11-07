import React, { useState, useEffect } from 'react';
import { cards } from './cardsData';

const OrderHistory = ({ cardStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    let amount = 0;
    let orders = 0;
    const uniqueIds = new Set();

    const completedOrders = cards.filter(card => cardStatus[card.orderId] === 'Completed');
    completedOrders.forEach(card => {
      const cardAmount = parseFloat(card.amount.replace('$', '')) || 0; // Remove dollar sign and parse as number
      amount += cardAmount;
      orders += card.numberOfOrders || 0; // Sum 'numberOfOrders' values
      uniqueIds.add(card.orderId); // Track unique order IDs
    });

    setTotalAmount(amount);
    setTotalOrders(orders);
    setTotalCustomers(uniqueIds.size);
    setFilteredCards(completedOrders);
  }, [cardStatus]);
 
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const displayedCards = filteredCards.filter((card) => {
    const term = searchTerm.toLowerCase();
    return (
      card.orderId.toLowerCase().includes(term) ||
      card.queueNumber.toString().includes(term) ||
      card.timeOrdered.toLowerCase().includes(term)
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
          placeholder="Search by Order ID, Queue Number, or Time"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {displayedCards.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No completed orders found.</p>
      ) : (
        displayedCards.map((card) => (
          <div key={card.orderId} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order ID: {card.orderId}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{card.timeOrdered}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <p><span className="font-semibold">Number of Orders:</span> {card.numberOfOrders}</p>
                <p><span className="font-semibold">Amount:</span> {card.amount}</p>
              </div>
              <div>
                <p><span className="font-semibold">Queue Number:</span> {card.queueNumber}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
