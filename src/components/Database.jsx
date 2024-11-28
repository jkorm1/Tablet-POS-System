import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const Database = createContext();

export const DataProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/orders')
            .then(response => {
                setCards(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const updateCardStatus = async (cardId, newStatus) => {
        try {
            await axios.put(`http://127.0.0.1:5000/api/orders/${cardId}/status`, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating card status:', error);
        }
    };
    
    return (
        <Database.Provider value={{ cards, loading, updateCardStatus }}>
            {children}
        </Database.Provider>
    );
};

export default Database;
