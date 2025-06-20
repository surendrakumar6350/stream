import React from 'react';
import { RotateCcw, Crown } from 'lucide-react';
import type { Stream, StreamUser } from '../types';

interface LuckyDrawModalProps {
  isOpen: boolean;
  stream: Stream | null;
  spinning: boolean;
  winner: StreamUser | null;
  spinRotation: number;
  onClose: () => void;
  onSpin: () => void;
}

const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({
  isOpen,
  stream,
  spinning,
  winner,
  spinRotation,
  onClose,
  onSpin
}) => {
  if (!isOpen || !stream) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-4 lg:p-8 text-center w-full max-w-md">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">Lucky Draw Spinner</h2>
        
        <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-6">
          {/* Spinner Circle */}
          <div 
            className={`w-full h-full rounded-full border-4 lg:border-8 border-gray-600 relative transition-transform duration-3000 ease-out`}
            style={{ transform: `rotate(${spinRotation}deg)` }}
          >
            {/* Spinner Segments */}
            {stream.participants.map((user, index) => {
              const angle = (360 / stream.participants.length) * index;
              const nextAngle = (360 / stream.participants.length) * (index + 1);
              const midAngle = (angle + nextAngle) / 2;
              const colors = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'];
              
              return (
                <div
                  key={user.id}
                  className="absolute w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(from ${angle}deg, ${colors[index % 5]} 0deg, ${colors[index % 5]} ${360 / stream.participants.length}deg, transparent ${360 / stream.participants.length}deg)`,
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                  }}
                >
                  <div
                    className="absolute text-white text-xs font-bold"
                    style={{
                      top: `${50 + 30 * Math.sin((midAngle - 90) * Math.PI / 180)}%`,
                      left: `${50 + 30 * Math.cos((midAngle - 90) * Math.PI / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {user.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 lg:border-l-4 lg:border-r-4 lg:border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>

        {winner && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" />
              <h3 className="text-lg lg:text-xl font-bold">Winner!</h3>
              <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" />
            </div>
            <p className="text-base lg:text-lg font-semibold">{winner.name}</p>
            <p className="text-sm text-gray-400">{winner.upi}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Close
          </button>
          <button
            onClick={onSpin}
            disabled={spinning}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <RotateCcw className="w-4 h-4" />
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawModal;