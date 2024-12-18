import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

function SwipeableCard({ card, cardStatus, onCardClick, onSwipeRight, forceRerender }) {
   const [isVisible, setIsVisible] = useState(true);
   const [position, setPosition] = useState(0);
   const isCompleted = cardStatus[card.user_id] === 'Completed';
   const isOnProcess = cardStatus[card.user_id] === 'On Process';
    // Only show cards where payment status is 'pending' (cart items)
   if (card.payment !== 'pending') return null;
    const totalAmount = Object.keys(card.containers).reduce((total, containerId) => {
       return total + card.containers[containerId].FoodItems.reduce((itemTotal, item) => {
           return itemTotal + parseFloat(item.Price);
       }, 0);
   }, 0).toFixed(2);
    const handlers = useSwipeable({
       onSwiping: (eventData) => {
           if (!isCompleted && eventData.dir === 'Right') {
               setPosition(eventData.deltaX);
           }
       },
       onSwipedRight: () => {
           if (!isCompleted && position > 100) {
               setIsVisible(false);
               setTimeout(() => {
                   onSwipeRight(card);
                   forceRerender();
               }, 200);
           } else {
               setPosition(0);
           }
       },
       onSwipedLeft: () => {
           if (!isCompleted) {
               setPosition(0);
           }
       },
       trackMouse: true,
       preventDefaultTouchmoveEvent: true,
       disabled: isCompleted
   });
    if (!isVisible) return null;
    const swipeProgress = Math.min(position / 200, 1);
    return (
       <div className="relative">
           {!isCompleted && (
               <div
                   className="absolute inset-0 rounded-lg flex items-center px-4"
                   style={{
                       background: 'linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.9))',
                       transform: `scaleX(${swipeProgress})`,
                       transformOrigin: 'left',
                       transition: 'transform 0.2s ease-out'
                   }}
               >
                   <span className="text-white flex items-center gap-2" style={{ opacity: swipeProgress }}>
                       <Check size={20} />
                       Completed
                   </span>
               </div>
           )}
            <div
               {...(!isCompleted ? handlers : {})}
               onClick={() => onCardClick(card)}
               className="relative"
               style={{
                   transform: `
                       translateX(${position}px) 
                       scale(${isOnProcess ? 1.03 : 1})
                   `,
                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                   cursor: 'pointer',
                   willChange: 'transform',
                   zIndex: isOnProcess ? 10 : 1
               }}
           >
               <Card 
                   className={`
                       relative border rounded-lg shadow-md md:w-[540px] h-[90px] py-2 
                       flex flex-col items-center justify-center bg-white 
                       transition-all duration-300
                       ${isOnProcess ? 'shadow-lg border-blue-200' : ''}
                       ${isCompleted ? 'hover:border-blue-300' : ''}
                   `}
                   style={{
                       transform: isOnProcess ? 'translateY(-2px)' : 'none',
                       boxShadow: isOnProcess ? '0 8px 16px rgba(0, 0, 0, 0.1)' : undefined
                   }}
               >
                   <div className="absolute bottom-0 left-0 right-0 h-0.25 bg-gradient-to-t from-gray-300 to-transparent"></div>
                   <CardHeader className="w-full">
                       <div className="flex justify-between -m-1 w-full items-center">
                           <CardTitle className="text-left text-sm">ID #{card.user_id}</CardTitle>
                           <CardDescription className="text-right text-xs">
                               {card.order_type === 'customer_online' ? 'Online Order' : card.order_type}
                           </CardDescription>
                       </div>
                       
                   </CardHeader>
                   <CardContent className="w-full flex justify-center">
                       <div className="flex justify-between items-start w-full">
                           <div className="flex flex-col items-start">
                               <p className="text-xs">Baskets: {Object.keys(card.containers).length}</p>
                           </div>
                           <div className="text-right flex flex-col">
                               <p className="font-bold text-md">₵{totalAmount}</p>
                               <p className={`text-xs mt-2 ${
                                   isCompleted ? 'text-green-600' : 
                                   isOnProcess ? 'text-blue-600 font-semibold' : 
                                   'text-gray-600'
                               }`}>
                                   {cardStatus[card.user_id] || 'Pending'}
                               </p>
                           </div>
                       </div>
                   </CardContent>
               </Card>
           </div>
       </div>
   );
};
export default SwipeableCard;