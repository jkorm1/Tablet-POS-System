import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SwipeableCard({ card, cardStatus, onCardClick, onSwipeLeft, forceRerender }) {
    const [swiped, setSwiped] = useState(false);
    // Check if the card is marked as completed
    const isCompleted = cardStatus[card.orderId] === 'Completed';

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (!isCompleted) { // Only allow swipe if the card is not completed
                console.log(`Swiped left on card ${card.orderId}`);
                setSwiped(true);
                onSwipeLeft(card);
                forceRerender();
            }
        },
    });

    const totalAmount = card.items.reduce((total, item) => { 
         return total + item.components.reduce((itemTotal, component) => {
         return itemTotal + parseFloat(component.price.slice(1)); 

        }, 0); 
    }, 0).toFixed(2);

    return (
        <div
            {...(!isCompleted ? handlers : {})} 
            className={`swipeable-card transition-transform duration-700 ease-in-out ${swiped ? 'translate-x-[-100%] opacity-0' : ''}`}
        >
            <div
                onClick={() => onCardClick(card)}
                className={`rounded-lg ml-2 cursor-pointer transition-transform duration-200 ${
                    cardStatus[card.orderId] === 'On Process' ? 'transform scale-105 shadow-lg border-blue-500' : ''
                }`}
            >
                <Card className="relative border rounded-lg shadow-md w-full md:w-[560px] h-[105px] p-3 flex flex-col items-center justify-center">
                    <CardHeader className="w-full">
                        <div className="flex justify-between w-full items-center">
                            <CardTitle className="text-left">Order #{card.orderId}</CardTitle>
                            <CardDescription className="text-right">{card.timeOrdered}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center">
                        <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col items-start">
                                <p className="text-sm">Queue Number: {card.queueNumber}</p>
                                <p className="text-sm">Baskets Ordered: {card.items.length}</p>
                            </div>
                            <div className="text-right flex flex-col">
                                <p className="font-bold text-lg">{totalAmount}</p>
                                <p className={`text-sm mt-2 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                    {cardStatus[card.orderId] || 'Pending'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SwipeableCard;
