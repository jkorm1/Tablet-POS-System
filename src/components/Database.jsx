import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const Database = createContext();

export const DataProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/cards')
            .then(response => {
                setCards(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <Database.Provider value={{ cards, loading }}>
            {children}
        </Database.Provider>
    );
};

export default Database;
