import React from 'react';
import { Search, Plus } from 'lucide-react';

interface HeaderProps {
  onCreateStream: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateStream }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Overview</h1>
        <p className="text-gray-400 mt-1 text-sm lg:text-base">Manage your streams and participants</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 flex-1 sm:flex-none">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full min-w-0 sm:w-40"
          />
        </div>
        <button
          onClick={onCreateStream}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Stream
        </button>
      </div>
    </div>
  );
};

export default Header;