import React from 'react';
import { Activity, BarChart3, Play, Users, Settings, Bell, Menu, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigationItems = [
    { icon: BarChart3, label: 'Overview', active: true },
    { icon: Play, label: 'Streams', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/10"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-0 left-0 top-0 h-screen lg:h-screen w-80 z-40
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700/50 backdrop-blur-xl
        transform transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
        lg:translate-x-0 lg:shadow-none
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/5 before:to-blue-600/5 before:pointer-events-none
      `}>
        {/* Header */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Stream Admin</h1>
              <p className="text-slate-400 text-sm">Dashboard v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 py-2 overflow-y-auto">
          <nav className="space-y-3">
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                Main Navigation
              </p>
              {navigationItems.map((item, index) => (
                <div
                  key={item.label}
                  className={`
                    group relative px-4 py-4 rounded-xl cursor-pointer transition-all duration-300
                    ${item.active
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white shadow-lg border border-purple-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-2 rounded-lg transition-all duration-300
                      ${item.active
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg'
                        : 'bg-slate-700/50 group-hover:bg-slate-600/70'
                      }
                    `}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.active && (
                      <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />
                    )}
                  </div>

                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-600 rounded-r-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Active Streams</span>
                  <span className="text-sm font-semibold text-green-400">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Users</span>
                  <span className="text-sm font-semibold text-blue-400">1,284</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Bandwidth</span>
                  <span className="text-sm font-semibold text-purple-400">2.4 GB/s</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;