import React, { useContext, useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Database from './database';

const Reports = () => {
    const { cards, loading } = useContext(Database);
    const [data, setData] = useState({});
    const [filter, setFilter] = useState('today');

    useEffect(() => {
        if (!loading) {
            const calculateData = () => {
                const totalSales = cards.reduce((sum, card) => {
                    return sum + Object.keys(card.containers).reduce((containerTotal, containerId) => {
                        return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                            return itemTotal + parseFloat(item.Price);
                        }, 0);
                    }, 0);
                }, 0);
                const transactions = cards.length;
                const avgTransaction = (totalSales / transactions).toFixed(2);
                const topProducts = cards.flatMap(card => Object.keys(card.containers).flatMap(containerId => 
                    card.containers[containerId].FoodItems.map(item => item.Food)
                ));
                const salesData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Sales ($)',
                            data: Array(12).fill(0).map((_, index) => cards.reduce((sum, card) => {
                                return sum + (index % 3 === 0 ? Object.keys(card.containers).reduce((containerTotal, containerId) => {
                                    return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
                                        return itemTotal + parseFloat(item.Price);
                                    }, 0);
                                }, 0) : 0);
                            }, 0)),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };
                
                return {
                    sales: totalSales.toFixed(2),
                    transactions,
                    avgTransaction,
                    topProducts,
                    salesData,
                };
            };

            const response = calculateData();
            setData(response);
        }
    }, [cards, loading, filter]);

    return (
        <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Reports</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    aria-label="Filter reports by period"
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {loading ? (
                <p className="text-gray-600 text-center animate-pulse">Loading data, please wait...</p>
            ) : data.salesData ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-dotted pb-2">
                                    <p className="text-lg font-medium text-gray-700">Total Sales:</p>
                                    <span className="font-semibold text-blue-600 text-lg">${data.sales}</span>
                                </div>
                                <div className="flex justify-between border-b border-dotted pb-2">
                                    <p className="text-lg font-medium text-gray-700">Number of Transactions:</p>
                                    <span className="font-semibold text-blue-600 text-lg">{data.transactions}</span>
                                </div>
                                <div className="flex justify-between border-b border-dotted pb-2">
                                    <p className="text-lg font-medium text-gray-700">Average Transaction Value:</p>
                                    <span className="font-semibold text-blue-600 text-lg">${data.avgTransaction}</span>
                                </div>
                                <div className="flex justify-between border-b border-dotted pb-2">
                                    <p className="text-lg font-medium text-gray-700">Top-Selling Products:</p>
                                    <span className="font-semibold text-blue-600 text-lg">{data.topProducts.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
                            <Bar data={data.salesData} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Sales Trends</h2>
                        <Line data={data.salesData} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
                        <Pie data={data.salesData} />
                    </div>

                    <div className="text-right space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Export to PDF
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Export to Excel
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-red-600 text-center">Failed to load data. Please try again later.</p>
            )}
        </div>
    );
};

export default Reports;
