import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import '../styles/OrderDetailSheet.css';

const OrderDetailSheet = ({ order, close, totalItems }) => {
    if (!order) return null;

    const totalAmount = order.items.reduce((total, item) => {
        return total + item.components.reduce((itemTotal, component) => {
            return itemTotal + parseFloat(component.price.slice(1));
        }, 0);
    }, 0).toFixed(2);

    const tax = (totalAmount * 0.02).toFixed(2);
    const totalToPay = (parseFloat(totalAmount) + parseFloat(tax)).toFixed(2);

    return (
        <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-6 z-20 overflow-y-auto">
            <button onClick={close} className="text-red-500 mb-4 text-lg font-semibold hover:underline">Close</button>
            <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Order #{order.orderId}</h2>
                <p className="text-gray-600">Number Of Baskets: <span className="font-semibold">{totalItems}</span></p>
            </div>
            <div className="mt-4">
                {order.items.map((item, index) => {
                    const totalItemPrice = item.components.reduce((total, component) => {
                        return total + parseFloat(component.price.slice(1));
                    }, 0).toFixed(2);

                    return (
                        <div key={index} className="mb-4">
                            <Card className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-blue-600 border-b pb-1">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-start">
                                    <p className="text-sm text-gray-500 italic mb-2">{item.content}</p>
                                    <div className="flex flex-col w-full">
                                        {item.components.map((component, componentIndex) => (
                                            <div key={componentIndex} className="flex items-center justify-between w-full mb-1">
                                                <p className="text-sm font-medium text-gray-800">{component.name}</p>
                                                <p className="font-bold text-lg text-gray-900">
                                                    {component.price}
                                                    <Badge className="ml-2 bg-red-500 text-white text-xs rounded">Refund</Badge>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between w-full mt-2 border-t pt-2 border-gray-200">
                                        <p className="font-bold text-lg text-gray-800">Total Price:</p>
                                        <p className="font-bold text-lg text-gray-900">${totalItemPrice}</p>
                                    </div>
                                    {item.message && (
                                        <div className="text-green-800 p-2 mt-2 text-xs flex items-center animate-bounce">
                                          <Smile className="mr-1 text-green-610" size={16}/> {item.message}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-md">
                <p className="font-bold text-lg text-green-700">Summary:</p>
                <p className="text-gray-700">Baskets: {totalItems}</p>
                <p className="text-gray-700">Total Amount: ${totalAmount}</p>
                <p className="text-gray-700">Tax: ${tax}</p>
                <p className="font-bold text-lg text-green-800">Total to Pay: ${totalToPay}</p>
            </div>
        </div>
    );
};

export default OrderDetailSheet;
