import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrderDetailSheet from './components/OrderDetailSheet';
import { SkeletonCard } from './components/SkeletonCard';
import SwipeableCard from './components/SwipeableCard.jsx';
import { cards } from './components/cardsData';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import OrderHistory from './components/OrderHistory';
import Notifications from './components/Notification';
import Reports from './components/Reports';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';

function App() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedCards, setExpandedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardStatus, setCardStatus] = useState({});
    const [showingStatus, setShowingStatus] = useState('onProcessOrPending');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reRender, setReRender] = useState(false); // State to force re-render
    const [swipeTimestamps, setSwipeTimestamps] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const initialCardStatus = {};
        cards.forEach(card => {
            initialCardStatus[card.orderId] = 'Pending';
        });
        setCardStatus(initialCardStatus);
    }, []);

    const handleCardClick = (order) => {
        setCardStatus(prevStatus => {
            const updatedStatus = { ...prevStatus };
            Object.keys(updatedStatus).forEach(orderId => {
                if (updatedStatus[orderId] === 'On Process' && orderId !== order.orderId) {
                    updatedStatus[orderId] = 'Pending';
                }
            });
            updatedStatus[order.orderId] = 'On Process';
            return updatedStatus;
        });
        setSelectedOrder(order);

        const newCards = Array.from({ length: order.numberOfOrders }, (_, index) => ({
            name: order.items[0].name,
            content: order.items[0].content,
            components: order.items[0].components,
            orderId: `${order.orderId}-item-${index + 1}`,
        }));
        setExpandedCards(newCards);
    };

    const handleSwipeLeft = (order) => {
        setCardStatus((prevStatus) => ({
            ...prevStatus,
            [order.orderId]: 'Completed',
        }));
        setSelectedOrder(null); // Deselect the order if it's swiped to completed
        setReRender(prev => !prev); // Trigger re-render
        setSwipeTimestamps((prevTimestamps) => [...prevTimestamps, { orderId: order.orderId, timestamp: new Date() }]);
    };
    

    const calculateSwipesPerHour = () => {
         const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
         return swipeTimestamps.filter(timestamp => timestamp >= oneHourAgo).length;
    };

    const closeOrderDetail = () => {
        if (window.confirm("Are you sure you want to close the order details?")) {
            setSelectedOrder(null);
            setExpandedCards([]);
        }
    };

    const totalItems = cards.reduce((total, card) => total + card.numberOfOrders, 0);
    const totalAmount = cards.reduce((total, card) => total + parseFloat(card.amount.slice(1)), 0);
    const tax = (totalAmount * 0.1).toFixed(2);
    const totalToPay = (totalAmount + parseFloat(tax)).toFixed(2);

    const filteredCards = cards.filter(card => {
        if (showingStatus === 'onProcessOrPending') {
            return cardStatus[card.orderId] === 'On Process' || cardStatus[card.orderId] === 'Pending';
        } else if (showingStatus === 'completed') {
            return cardStatus[card.orderId] === 'Completed';
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
                                    <div className="flex flex-col w-full md:w-[560px] space-y-4">
                                        {loading ? (
                                            Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                                        ) : (
                                            filteredCards.map((card, index) => (
                                                <SwipeableCard
                                                    key={index}
                                                    card={card}
                                                    cardStatus={cardStatus}
                                                    onCardClick={handleCardClick}
                                                    onSwipeLeft={handleSwipeLeft}
                                                    forceRerender={() => setReRender(prev => !prev)}
                                                />
                                            ))
                                        )}
                                    </div>
                                    <OrderDetailSheet
                                        order={selectedOrder}
                                        totalItems={selectedOrder ? selectedOrder.items.length : 0}
                                        close={closeOrderDetail}
                                        totalAmount={totalAmount}
                                        tax={tax}
                                        totalToPay={totalToPay}
                                    />
                                </div>
                            } />
                            <Route path="/profile" element={<UserProfile onLogout={handleLogout} calculateSwipesPerHour={calculateSwipesPerHour}/>} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/order-history" element={<OrderHistory cardStatus={cardStatus} />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/user-management" element={<UserManagement />} />
                        </Routes>
                    </div>
                </Router>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
