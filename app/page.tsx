"use client"
import React, { useState, useEffect, useRef } from 'react';
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
  joined: boolean;
}

type ApiResponse = {
  success: boolean;
  streams: Stream[];
};

const StreamsDashboard: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<boolean>(true);
  const [joiningStreamId, setJoiningStreamId] = useState<string | null>(null);

  useEffect(() => {
    fetchRunningStreams();

    const interval = setInterval(() => {
      fetchRunningStreams();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchRunningStreams = async (): Promise<void> => {
    try {
      if (loadingRef.current) setLoading(true);
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
      loadingRef.current = false;
    }
  };

  const handleJoinStream = async (streamId: string): Promise<void> => {
    try {
      setJoiningStreamId(streamId); // show joining...
      const response = await axios.get(
        `${BASE_URL}/api/payment/create?streamId=${streamId}`
      );

      if (response.data.success) {
        const payuFormHtml = response.data.res;
        const container = document.createElement('div');
        container.innerHTML = payuFormHtml;
        document.body.appendChild(container);

        const form = container.querySelector('form') as HTMLFormElement;
        if (form) {
          form.submit();
        } else {
          console.error('Form not found in PayU response');
        }
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      window.location.href = "/login";
    } finally {
      setJoiningStreamId(null); // reset
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Loading Streams...</h2>
          <p className="text-sm sm:text-base text-gray-300">Fetching live streams for you</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Error Loading Streams</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 px-4">{error}</p>
          <button
            onClick={fetchRunningStreams}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Play className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">No Active Streams</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            There are currently no live streams running. Check back later!
          </p>
          <button
            onClick={fetchRunningStreams}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Refresh Streams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text transparent px-2">
            Live Streams Dashboard
          </h1>

          {/* Stats Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 sm:px-6 sm:py-4 border border-white/20">
              <Users className="text-purple-400 flex-shrink-0" size={20} />
              <span className="text-white font-semibold text-sm sm:text-base text-center">
                Total Participants: {getTotalParticipants()}
              </span>
            </div>
            <button
              onClick={fetchRunningStreams}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 sm:px-6 border border-white/20 hover:bg-white/20 transition-all duration-200 text-white text-sm sm:text-base"
              disabled={loading}
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Streams Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {streams.map((stream) => {
            const streamId = getStreamId(stream);
            const isJoined = stream.joined;

            return (
              <div
                key={streamId}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Stream Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium text-red-400 uppercase tracking-wide">
                      {stream.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs">Live</span>
                  </div>
                </div>

                {/* Stream Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                  {stream.title || 'Untitled Stream'}
                </h3>

                {/* Stream Description */}
                <p className="text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                  {stream.description || 'No description available'}
                </p>

                {/* Host */}
                <p className="text-purple-300 text-sm font-medium mb-3 sm:mb-4 truncate">
                  Host: {stream.host || 'Unknown Host'}
                </p>

                {/* Price */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {formatPrice(stream.price)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Stream Price</div>
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={16} />
                    <span className="text-white font-medium text-sm sm:text-base">
                      {stream.participants?.length || 0} participants
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-400 mb-3 sm:mb-4 truncate">
                  Started: {stream.createdAt ? formatDate(stream.createdAt) : 'Unknown'}
                </div>

                {/* Join Button - Touch Friendly */}
                <button
                  onClick={() => handleJoinStream(streamId)}
                  disabled={isJoined || joiningStreamId === streamId}
                  className={`w-full py-3 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px] cursor-pointer ${isJoined
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : joiningStreamId === streamId
                      ? 'bg-purple-500/40 text-purple-200 cursor-wait'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95'
                    }`}
                >
                  {isJoined ? (
                    <>
                      <Check size={16} className="sm:w-5 sm:h-5" />
                      Joined
                    </>
                  ) : joiningStreamId === streamId ? (
                    <>
                      <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Play size={16} className="sm:w-5 sm:h-5" />
                      Join Stream
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Stats - Mobile Responsive */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 py-4 sm:px-8 border border-white/10 mx-auto max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{streams.length}</div>
                <div className="text-xs sm:text-sm text-gray-400">Active Streams</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{getTotalParticipants()}</div>
                <div className="text-xs sm:text-sm text-gray-400">Total Participants</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{streams.filter((stream) => stream.joined).length}</div>
                <div className="text-xs sm:text-sm text-gray-400">Streams Joined</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsDashboard;