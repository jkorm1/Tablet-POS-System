import React, { useContext, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Database from './database';

function SwipeableCard({ card, cardStatus, onCardClick, onSwipeRight, forceRerender }) {
    const [translateX, setTranslateX] = useState(0);
    const [swipingRight, setSwipingRight] = useState(false);
    const { cards } = useContext(Database);

    const isCompleted = cardStatus[card.user_id] === 'Completed';

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            setTranslateX(eventData.absX); // Positive to move right
            if (eventData.dir === 'Right') {
                setSwipingRight(true); // Set swiping right to true on swiping right
            }
        },
        onSwipedRight: () => {
            if (!isCompleted) {
                setTranslateX(window.innerWidth); // Move card right off screen
                onSwipeRight(card);
                setTimeout(() => {
                    cardStatus[card.user_id] = 'Completed';
                    setSwipingRight(false); // Reset swiping right after completing swipe
                    forceRerender();
                }, 300); // Adjust timing as necessary
            }
        },
        onSwipedLeft: () => {
            setSwipingRight(false); // Reset if swipe is canceled
            setTranslateX(0); // Reset if swipe is canceled
        }
    });

    const totalAmount = Object.keys(card.containers).reduce((containerTotal, containerId) => {
        return containerTotal + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
            return itemTotal + parseFloat(item.Price);
        }, 0);
    }, 0).toFixed(2);

    const traceWidth = Math.min(translateX, window.innerWidth);

    return (
        <div
            {...(!isCompleted ? handlers : {})}
            className={`swipeable-card relative transition-colors duration-300 ease-in-out`}
            style={{
                transform: `translateX(${translateX}px)`,
                transition: !isCompleted && translateX === 0 ? 'none' : 'transform 0.3s ease-in-out'
            }}
        >
            <div className="absolute w-full h-full flex items-center justify-start right-0 bg-gradient-to-l from-green-500 to-white pr-[450px] rounded-tr-lg rounded-br-lg"
                style={{
                    width: `${traceWidth}px`,
                    zIndex: -1 // Ensure the trace is behind the card content
                }}
            >
                <span className="text-black font-bold">complete</span>
            </div>
            <div
                onClick={() => onCardClick(card)}
                className={`rounded-lg ml-1 cursor-pointer transition-transform duration-200 ${cardStatus[card.user_id] === 'On Process' ? 'transform scale-105 shadow-lg border-blue-500' : ''}`}
            >
                <Card className="relative border rounded-lg shadow-md md:w-[540px] h-[90px] py-2 flex flex-col items-center justify-center bg-gradient-to-l from-transparent to-white">
                    <div className="absolute bottom-0 left-0 right-0 h-0.25 bg-gradient-to-t from-gray-300 to-transparent"></div>
                    <CardHeader className="w-full">
                        <div className="flex justify-between -m-1 w-full items-center">
                            <CardTitle className="text-left text-sm">ID #{card.user_id}</CardTitle>
                            <CardDescription className="text-right text-xs">{card.order_type}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center">
                        <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col items-start">
                                <p className="text-xs">Baskets: {Object.keys(card.containers).length}</p>
                            </div>
                            <div className="text-right flex flex-col">
                                <p className="font-bold text-md">${totalAmount}</p>
                                <p className={`text-xs mt-2 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                    {cardStatus[card.user_id] || 'Pending'}
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
