import React, { useEffect } from 'react';
import { RotateCcw, Crown, X, Sparkles } from 'lucide-react';
import type { Stream, StreamUser } from '../types';

interface LuckyDrawModalProps {
  isOpen: boolean;
  stream: Stream | null;
  spinning: boolean;
  winner: StreamUser | null;
  spinRotation: number;
  onClose: () => void;
  onSpin: () => void;
  onWinnerClear?: () => void;
}

const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({
  isOpen,
  stream,
  spinning,
  winner,
  spinRotation,
  onClose,
  onSpin,
  onWinnerClear
}) => {
  const participants = stream?.participants || [];
  const vibrantColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'
  ];

  // Clear winner when component unmounts or closes
  useEffect(() => {
    return () => {
      if (onWinnerClear) {
        onWinnerClear();
      }
    };
  }, [onWinnerClear]);

  const handleClose = () => {
    if (onWinnerClear) {
      onWinnerClear();
    }
    onClose();
  };

  if (!isOpen || !stream) return null;

  const generateWheelSegments = () => {
    if (participants.length === 0) return '';

    return participants.map((_, index) => {
      const startAngle = (index / participants.length) * 360;
      const endAngle = ((index + 1) / participants.length) * 360;
      const color = vibrantColors[index % vibrantColors.length];
      return `${color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl mx-4 my-4 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh]">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-4 sm:p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              <h2 className="text-xl sm:text-2xl font-bold">Lucky Draw</h2>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
            </div>
            <p className="text-sm sm:text-base text-white/90">
              {participants.length} participants ready!
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-h-[70vh] overflow-y-auto">

          {/* Modern Spinner Wheel */}
          <div className="relative flex items-center justify-center mb-6 sm:mb-8">

            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-20 blur-xl scale-110"></div>

            {/* Main Wheel Container */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl p-3 sm:p-4">

              {/* Spinning Wheel */}
              <div
                className="relative w-full h-full rounded-full shadow-inner transition-transform duration-[3000ms] ease-out overflow-hidden"
                style={{
                  transform: `rotate(${spinRotation}deg)`,
                  background: participants.length > 0 ?
                    `conic-gradient(${generateWheelSegments()})` :
                    'linear-gradient(45deg, #8B5CF6, #EC4899, #06B6D4, #10B981)'
                }}
              >

                {/* Segment Dividers */}
                {participants.map((_, index) => {
                  const angle = (index / participants.length) * 360;
                  return (
                    <div
                      key={index}
                      className="absolute w-full h-0.5 bg-white/30 origin-left top-1/2"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        left: '50%',
                        transformOrigin: '0 50%'
                      }}
                    />
                  );
                })}

                {/* Center Hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-200 relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100"></div>
                    <RotateCcw className={`w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-violet-600 relative z-10 ${spinning ? 'animate-spin' : ''}`} />
                  </div>
                </div>

                {/* Spinning Effect Overlay */}
                {spinning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute top-2 sm:top-1 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Winner Celebration */}
          {winner && (
            <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-4 sm:p-6 mb-6 text-center text-white shadow-lg overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-8 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              </div>

              <div className="relative z-10">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-yellow-100 animate-bounce" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 animate-pulse">🎉 WINNER! 🎉</h3>
                <p className="text-xl sm:text-2xl font-bold mb-1">{winner.name}</p>
                <p className="text-sm sm:text-base text-white/90 font-mono bg-black/20 rounded-lg px-3 py-1 inline-block">
                  {winner.upi}
                </p>
                <br></br>
                <p className="text-sm sm:text-base text-white/90 font-mono bg-black/20 rounded-lg px-3 py-1 inline-block">
                  {winner.mobile}
                </p>
              </div>
            </div>
          )}

          {/* No Participants State */}
          {participants.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
              <div className="text-amber-600 mb-2">⚠️</div>
              <p className="text-amber-800 font-medium">No participants available for the draw!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
            >
              Close
            </button>
            <button
              onClick={onSpin}
              disabled={spinning || participants.length === 0}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${spinning || participants.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
            >
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${spinning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {spinning ? 'Spinning...' : 'Spin Wheel!'}
              </span>
              <span className="sm:hidden">
                {spinning ? 'Spinning...' : 'Spin!'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawModal;