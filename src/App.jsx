import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrderDetailSheet from './components/OrderDetailSheet';
import { SkeletonCard } from './components/SkeletonCard';
import SwipeableCard from './components/SwipeableCard.jsx';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import OrderHistory from './components/OrderHistory';
import Notifications from './components/Notification';
import Reports from './components/Reports';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import { DataProvider } from './components/database';

function App() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedCards, setExpandedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardStatus, setCardStatus] = useState({});
    const [showingStatus, setShowingStatus] = useState('onProcessOrPending');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reRender, setReRender] = useState(false); // State to force re-render
    const [swipeTimestamps, setSwipeTimestamps] = useState([]);
    const [cards, setCards] = useState([]); // New state for fetched cards

    // Fetch data from the Flask backend
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/cards')
            .then(response => {
                setCards(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const initialCardStatus = {};
        cards.forEach(card => {
            initialCardStatus[card.user_id] = 'Pending';
        });
        setCardStatus(initialCardStatus);
    }, [cards]);

    const handleCardClick = (order) => {
        setCardStatus(prevStatus => {
            const updatedStatus = { ...prevStatus };
            Object.keys(updatedStatus).forEach(userId => {
                if (updatedStatus[userId] === 'On Process' && userId !== order.user_id) {
                    updatedStatus[userId] = 'Pending';
                }
            });
            updatedStatus[order.user_id] = 'On Process';
            return updatedStatus;
        });
        setSelectedOrder(order);

        const newCards = Object.keys(order.containers).map(containerId => ({
            ...order.containers[containerId],
            user_id: `${order.user_id}-item-${containerId}`
        }));
        setExpandedCards(newCards);
    };

    const handleSwipeRight = (order) => {
        setCardStatus((prevStatus) => ({
            ...prevStatus,
            [order.user_id]: 'Completed',
        }));
        setSelectedOrder(null); // Deselect the order if it's swiped to completed
        setReRender(prev => !prev); // Trigger re-render
        setSwipeTimestamps((prevTimestamps) => [...prevTimestamps, { user_id: order.user_id, timestamp: new Date() }]);
    };

    const calculateSwipesPerHour = () => {
        const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
        return swipeTimestamps.filter(timestamp => timestamp.timestamp >= oneHourAgo).length;
    };

    const closeOrderDetail = () => {
        if (window.confirm("Are you sure you want to close the order details?")) {
            setSelectedOrder(null);
            setExpandedCards([]);
        }
    };

    const totalItems = cards.reduce((total, card) => total + Object.keys(card.containers).length, 0);
    const totalAmount = cards.reduce((total, card) => {
        return total + Object.keys(card.containers).reduce((containerTotal, containerId) => {
            return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                return itemTotal + parseFloat(item.Price);
            }, 0);
        }, 0);
    }, 0).toFixed(2);
    const tax = (totalAmount * 0.1).toFixed(2);
    const totalToPay = (parseFloat(totalAmount) + parseFloat(tax)).toFixed(2);

    const filteredCards = cards.filter(card => {
        if (showingStatus === 'onProcessOrPending') {
            return cardStatus[card.user_id] === 'On Process' || cardStatus[card.user_id] === 'Pending';
        } else if (showingStatus === 'completed') {
            return cardStatus[card.user_id] === 'Completed';
        }
        return false; // Ensure no cards are shown when neither button is active
    });

    const handleLogin = (credentials) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="bg-gray-200 h-screen flex overflow-hidden">
            {isLoggedIn ? (
                <DataProvider>
                    <Router>
                        <Sidebar />
                        <div className="ml-[80px] p-4 w-full flex-grow overflow-auto">
                            <Routes>
                                <Route path="/" element={
                                    <div className="space-y-4">
                                        <div className="flex space-x-4 mb-4">
                                            <button
                                                className={`bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded ${showingStatus === 'onProcessOrPending' ? 'bg-blue-600' : ''}`}
                                                onClick={() => setShowingStatus('onProcessOrPending')}
                                            >
                                                On Process
                                            </button>
                                            <button
                                                className={`bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded ${showingStatus === 'completed' ? 'bg-blue-600' : ''}`}
                                                onClick={() => setShowingStatus('completed')}
                                            >
                                                Completed
                                            </button>
                                        </div>
                                        <div className="flex flex-col md:w-[540px] space-y-3">
                                            {loading ? (
                                                Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                                            ) : (
                                                filteredCards.map((card, index) => (
                                                    <SwipeableCard
                                                        key={index}
                                                        card={card}
                                                        cardStatus={cardStatus}
                                                        onCardClick={handleCardClick}
                                                        onSwipeRight={handleSwipeRight}
                                                        forceRerender={() => setReRender(prev => !prev)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <OrderDetailSheet
                                            order={selectedOrder}
                                            totalItems={selectedOrder ? Object.keys(selectedOrder.containers).length : 0}
                                            close={closeOrderDetail}
                                            totalAmount={totalAmount}
                                            tax={tax}
                                            totalToPay={totalToPay}
                                        />
                                    </div>
                                } />
                                <Route path="/profile" element={<UserProfile onLogout={handleLogout} calculateSwipesPerHour={calculateSwipesPerHour} cardStatus={cardStatus} />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/order-history" element={<OrderHistory cardStatus={cardStatus} />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/user-management" element={<UserManagement />} />
                            </Routes>
                        </div>
                    </Router>
                </DataProvider>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
