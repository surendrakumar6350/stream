"use client"
import React, { useState, useEffect } from 'react';
import { Users, Play, Check, Clock, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/constants';

interface Stream {
  _id: string;
  id?: string;
  price: number;
  status: 'running' | 'stopped' | 'completed';
  participants: string[];
  createdAt: string;
  title?: string;
  description?: string;
  host?: string;
}

type ApiResponse = {
  success: boolean;
  streams: Stream[];
};

const StreamsDashboard: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [joinedStreams, setJoinedStreams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRunningStreams();
  }, []);

  const fetchRunningStreams = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/api/stream/fetch/running/stream`
      );

      const streamsData = response.data?.streams || [];
      setStreams(streamsData);
    } catch (error) {
      console.error('Error fetching streams:', error);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  const handleJoinStream = (streamId: string): void => {
    setJoinedStreams(prev => new Set([...prev, streamId]));

    // Update the stream's participants count
    setStreams(prevStreams =>
      prevStreams.map(stream => {
        const id = stream._id || stream.id || '';
        return id === streamId
          ? { ...stream, participants: [...stream.participants, 'current_user_id'] }
          : stream;
      })
    );
  };

  const formatPrice = (price: number): string => {
    return "₹" + price.toString();
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getTotalParticipants = (): number => {
    return streams.reduce((total, stream) => total + (stream.participants?.length || 0), 0);
  };

  const getStreamId = (stream: Stream): string => {
    return stream._id || stream.id || '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Streams...</h2>
          <p className="text-gray-300">Fetching live streams for you</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Streams</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchRunningStreams}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No streams state
  if (streams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">No Active Streams</h2>
          <p className="text-xl text-gray-300 mb-8">
            There are currently no live streams running. Check back later!
          </p>
          <button
            onClick={fetchRunningStreams}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Loader2 className="w-5 h-5" />
            Refresh Streams
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Users className="text-purple-400" size={24} />
              <span className="text-white font-semibold">
                Total Active Participants: {getTotalParticipants()}
              </span>
            </div>
            <button
              onClick={fetchRunningStreams}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
              disabled={loading}
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => {
            const streamId = getStreamId(stream);
            const isJoined = joinedStreams.has(streamId);

            return (
              <div
                key={streamId}
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
                  {stream.title || 'Untitled Stream'}
                </h3>

                {/* Stream Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {stream.description || 'No description available'}
                </p>

                {/* Host */}
                <p className="text-purple-300 text-sm font-medium mb-4">
                  Host: {stream.host || 'Unknown Host'}
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
                      {stream.participants?.length || 0} participants
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-400 mb-4">
                  Started: {stream.createdAt ? formatDate(stream.createdAt) : 'Unknown'}
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinStream(streamId)}
                  disabled={isJoined}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isJoined
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                >
                  {isJoined ? (
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
            );
          })}
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