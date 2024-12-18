import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const OrderDetailSheet = ({ order, close, totalItems }) => {
    if (!order) return null;

    const totalAmount = Object.keys(order.containers).reduce((containerTotal, containerId) => (
        containerTotal + order.containers[containerId].FoodItems.reduce((itemTotal, item) => (
            itemTotal + parseFloat(item.Price)
        ), 0)
    ), 0).toFixed(2);

    const tax = (totalAmount * 0.02).toFixed(2);
    const totalToPay = (parseFloat(totalAmount) + parseFloat(tax)).toFixed(2);

    return (
        <div className="fixed right-0 top-0 w-[27%] h-full bg-white shadow-md p-3 z-20 overflow-y-auto">
            <button onClick={close} className="text-red-500 mb-1 text-xs font-medium hover:underline">Close</button>
            <div className="mb-2 bg-gray-100 p-2 rounded-md shadow">
                <div className="flex justify-between items-center">
                    <h2 className="text-xs font-semibold text-gray-800">Order #{order.user_id}</h2>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-blue-500" />
                        <span className="text-xs text-blue-500">Processing</span>
                    </div>
                </div>
                <p className="text-xs text-gray-600">Containers: <span className="font-medium">{totalItems}</span></p>
            </div>
            <div className="mt-2 space-y-2">
                {Object.keys(order.containers).map((containerId, index) => {
                    const container = order.containers[containerId];
                    const totalItemPrice = container.FoodItems.reduce((itemTotal, item) => (
                        itemTotal + parseFloat(item.Price)
                    ), 0).toFixed(2);

                    return (
                        <Card key={index} className="border rounded-md shadow">
                            <CardHeader>
                                <CardTitle className="text-xs font-semibold text-blue-600">Basket {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {container.FoodItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex justify-between text-xs">
                                        <span className="font-medium text-gray-800">{item.food_name}</span>
                                        <span className="font-semibold text-gray-900">
                                            ₵{item.Price}
                                            <Badge className="ml-1 bg-red-500 text-white text-[7px] rounded py-0.5 px-2">Refund</Badge>
                                        </span>
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 italic">
                                    Packaging: <span className="font-medium text-blue-600">{container.PackagingType}</span>
                                </p>
                                <div className="flex justify-between text-xs mt-2 border-t pt-1">
                                    <span className="font-semibold text-gray-800">Total:</span>
                                    <span className="font-semibold text-gray-900">₵{totalItemPrice}</span>
                                </div>
                                {container.message && (
                                    <div className="text-green-800 animate-slide-left-right flex items-center text-[9.5px]">
                                        <Smile className="mr-1 text-green-600" size={10} /> {container.message}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <div className="mt-3 p-2 bg-green-50 border border-green-300 rounded-md">
                <p className="text-xs font-semibold text-green-700">Summary:</p>
                <p className="text-xs text-gray-700">Containers: {totalItems}</p>
                <p className="text-xs text-gray-700">Total: ₵{totalAmount}</p>
                <p className="text-xs text-gray-700">Tax: ₵{tax}</p>
                <p className="text-sm font-semibold text-green-800">Total to Pay: ₵{totalToPay}</p>
            </div>
        </div>
    );
};

export default OrderDetailSheet;