import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import OrderDetailSheet from './components/OrderDetailSheet';
import { SkeletonCard } from './components/SkeletonCard';
import SwipeableCard from './components/SwipeableCard.jsx';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import OrderHistory from './components/OrderHistory';
import Notifications from './components/Notification';
import Reports from './components/Reports';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import { DataProvider } from './components/database';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedCards, setExpandedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardStatus, setCardStatus] = useState({});
    const [showingStatus, setShowingStatus] = useState('onProcessOrPending');
    const [reRender, setReRender] = useState(false);
    const [swipeTimestamps, setSwipeTimestamps] = useState([]);
    const [cards, setCards] = useState([]);

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

    const handleCardClick = (card) => {
        if (cardStatus[card.user_id] === 'Completed') {
            setSelectedOrder(card);
        } else {
            setCardStatus(prev => {
                const newStatus = { ...prev };
                Object.keys(newStatus).forEach(id => {
                    if (newStatus[id] === 'On Process') {
                        newStatus[id] = 'Pending';
                    }
                });
                newStatus[card.user_id] = 'On Process';
                return newStatus;
            });
            setSelectedOrder(card);
        }
    };

    const handleSwipeRight = (card) => {
        setCardStatus(prev => ({
            ...prev,
            [card.user_id]: 'Completed'
        }));
    };

    const calculateSwipesPerHour = () => {
        const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
        return swipeTimestamps.filter(timestamp => timestamp.timestamp >= oneHourAgo).length;
    };

    const closeOrderDetail = () => {
        setCardStatus(prev => {
            const newStatus = { ...prev };
            Object.keys(newStatus).forEach(id => {
                if (newStatus[id] === 'On Process') {
                    newStatus[id] = 'Pending';
                }
            });
            return newStatus;
        });
        setSelectedOrder(null);
    };

    const totalItems = cards.reduce((total, card) => 
        total + Object.keys(card.containers).length, 0);

    const totalAmount = cards.reduce((total, card) => {
        return total + Object.keys(card.containers).reduce((containerTotal, containerId) => {
            return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                return itemTotal + parseFloat(item.Price);
            }, 0);
        }, 0);
    }, 0).toFixed(2);

    const tax = (totalAmount * 0.1).toFixed(2);
    const totalToPay = (parseFloat(totalAmount) + parseFloat(tax)).toFixed(2);

    const filteredCards = useMemo(() => {
        if (!cards) return [];
        return cards.filter(card => {
            if (showingStatus === 'completed') {
                return cardStatus[card.user_id] === 'Completed';
            } else {
                return !cardStatus[card.user_id] || cardStatus[card.user_id] === 'Pending' || cardStatus[card.user_id] === 'On Process';
            }
        });
    }, [cards, cardStatus, showingStatus]);

    return (
        <AuthProvider>
                <DataProvider>
                    <Router>
                        <div className="bg-gray-200 h-screen flex overflow-hidden">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/*" element={
                                    <ProtectedRoute>
                                        <>
                                            <Sidebar />
                                            <div className="ml-[80px] p-4 w-full flex-grow overflow-auto">
                                                <Routes>
                                                    <Route path="/" element={
                                                        <div className="space-y-4">
                                                            <div className="flex space-x-4 mb-4">
                                                                <button
                                                                    className={`bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded ${
                                                                        showingStatus === 'onProcessOrPending' ? 'bg-blue-600' : ''
                                                                    }`}
                                                                    onClick={() => setShowingStatus('onProcessOrPending')}
                                                                >
                                                                    Active Orders
                                                                </button>
                                                                <button
                                                                    className={`bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded ${
                                                                        showingStatus === 'completed' ? 'bg-blue-600' : ''
                                                                    }`}
                                                                    onClick={() => setShowingStatus('completed')}
                                                                >
                                                                    Completed
                                                                </button>
                                                            </div>
                                                            <div className="flex flex-col md:w-[540px] space-y-3">
                                                                {loading ? (
                                                                    Array.from({ length: 3 }).map((_, index) => (
                                                                        <SkeletonCard key={index} />
                                                                    ))
                                                                ) : (
                                                                    filteredCards.map((card) => (
                                                                        <SwipeableCard
                                                                            key={card.user_id}
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
                                                    <Route path="/profile" element={
                                                        <UserProfile 
                                                            calculateSwipesPerHour={calculateSwipesPerHour}
                                                            cardStatus={cardStatus}
                                                        />
                                                    } />
                                                    <Route path="/dashboard" element={<Dashboard />} />
                                                    <Route path="/order-history" element={
                                                        <OrderHistory cardStatus={cardStatus} />
                                                    } />
                                                    <Route path="/notifications" element={<Notifications />} />
                                                    <Route path="/reports" element={<Reports />} />
                                                    <Route path="/settings" element={<Settings />} />
                                                    <Route path="/user-management" element={<UserManagement />} />
                                                </Routes>
                                            </div>
                                        </>
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </div>
                    </Router>
                </DataProvider>
        </AuthProvider>
    );
}

export default App;