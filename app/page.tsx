"use client";
import React, { useState } from 'react';
import { Users, Play, Check, Clock } from 'lucide-react';

const StreamsDashboard = () => {
  const [streams, setStreams] = useState([
    {
      id: 'ObjectId("685588ccc8103fcfacd6b50")',
      price: 251016,
      status: 'running',
      participants: ['ObjectId("685582eef8634b1ae36eef9")'],
      createdAt: '2025-06-20T16:14:04.476+00:00',
      title: 'Advanced JavaScript Masterclass',
      description: 'Deep dive into modern JavaScript concepts and best practices',
      host: 'John Developer'
    },
    {
      id: 'ObjectId("685588ddd8103fcfacd6b51")',
      price: 189500,
      status: 'running',
      participants: [
        'ObjectId("685582eef8634b1ae36eef9")',
        'ObjectId("685582eef8634b1ae36eef8")',
        'ObjectId("685582eef8634b1ae36eef7")'
      ],
      createdAt: '2025-06-20T15:30:12.234+00:00',
      title: 'React Performance Optimization',
      description: 'Learn to build lightning-fast React applications',
      host: 'Sarah React'
    },
    {
      id: 'ObjectId("685588eee8103fcfacd6b52")',
      price: 75000,
      status: 'running',
      participants: [
        'ObjectId("685582eef8634b1ae36eef9")',
        'ObjectId("685582eef8634b1ae36eef8")',
        'ObjectId("685582eef8634b1ae36eef7")',
        'ObjectId("685582eef8634b1ae36eef6")',
        'ObjectId("685582eef8634b1ae36eef5")'
      ],
      createdAt: '2025-06-20T14:45:33.567+00:00',
      title: 'CSS Grid & Flexbox Workshop',
      description: 'Master modern CSS layout techniques',
      host: 'Mike Styles'
    },
    {
      id: 'ObjectId("685588fff8103fcfacd6b53")',
      price: 320000,
      status: 'running',
      participants: [
        'ObjectId("685582eef8634b1ae36eef9")',
        'ObjectId("685582eef8634b1ae36eef8")'
      ],
      createdAt: '2025-06-20T13:20:45.890+00:00',
      title: 'Full Stack Development Bootcamp',
      description: 'Complete guide to modern web development',
      host: 'Alex Fullstack'
    }
  ]);

  const [joinedStreams, setJoinedStreams] = useState(new Set());

  const handleJoinStream = (streamId: any) => {
    setJoinedStreams(prev => new Set([...prev, streamId]));
    
    // Update the stream's participants count
    setStreams(prevStreams => 
      prevStreams.map(stream => 
        stream.id === streamId 
          ? { ...stream, participants: [...stream.participants, 'ObjectId("current_user_id")'] }
          : stream
      )
    );
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price / 100);
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalParticipants = () => {
    return streams.reduce((total, stream) => total + stream.participants.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Live Streams Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Join live educational streams and learn from industry experts
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <Users className="text-purple-400" size={24} />
            <span className="text-white font-semibold">
              Total Active Participants: {getTotalParticipants()}
            </span>
          </div>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Stream Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-400 uppercase tracking-wide">
                    {stream.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <Clock size={16} />
                  <span className="text-xs">Live</span>
                </div>
              </div>

              {/* Stream Title */}
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {stream.title}
              </h3>

              {/* Stream Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {stream.description}
              </p>

              {/* Host */}
              <p className="text-purple-300 text-sm font-medium mb-4">
                Host: {stream.host}
              </p>

              {/* Price */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 mb-4">
                <div className="text-2xl font-bold text-white">
                  {formatPrice(stream.price)}
                </div>
                <div className="text-sm text-gray-300">Stream Price</div>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-400" size={18} />
                  <span className="text-white font-medium">
                    {stream.participants.length} participants
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400 mb-4">
                Started: {formatDate(stream.createdAt)}
              </div>

              {/* Join Button */}
              <button
                onClick={() => handleJoinStream(stream.id)}
                disabled={joinedStreams.has(stream.id)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  joinedStreams.has(stream.id)
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {joinedStreams.has(stream.id) ? (
                  <>
                    <Check size={18} />
                    Joined
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Join Stream
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streams.length}</div>
              <div className="text-sm text-gray-400">Active Streams</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{getTotalParticipants()}</div>
              <div className="text-sm text-gray-400">Total Participants</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{joinedStreams.size}</div>
              <div className="text-sm text-gray-400">Streams Joined</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsDashboard;