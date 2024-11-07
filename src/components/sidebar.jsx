import React from 'react';
import { ShoppingCart, History, Bell, BarChart, Settings, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-20 bg-gray-800 text-white shadow-lg p-2 flex flex-col items-center space-y-2">
      <ul className="space-y-6 mt-2">
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ATI</AvatarFallback>
            </Avatar>
            <span className="text-xs">Profile</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/" className="flex flex-col items-center space-y-1">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs">Orders</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/dashboard" className="flex flex-col items-center space-y-1">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Dash</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/order-history" className="flex flex-col items-center space-y-1">
            <History className="w-5 h-5" />
            <span className="text-xs">History</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/notifications" className="flex flex-col items-center space-y-1">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notify</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/reports" className="flex flex-col items-center space-y-1">
            <BarChart className="w-5 h-5" />
            <span className="text-xs">Reports</span>
          </Link>
        </li>
        <li className="flex flex-col items-center space-y-1 transform transition-transform duration-200 hover:scale-110 p-1">
          <Link to="/settings" className="flex flex-col items-center space-y-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
