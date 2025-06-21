import React from 'react';
import { Eye, Square, CheckCircle } from 'lucide-react';
import type { Stream } from '../types';

interface StreamsTableProps {
  streams: Stream[];
  activeTab: 'running' | 'stopped' | 'completed';
  onTabChange: (tab: 'running' | 'stopped' | 'completed') => void;
  onViewStream: (stream: Stream) => void;
  onStatusChange: (streamId: string, newStatus: 'stopped' | 'completed') => void;
}

const StreamsTable: React.FC<StreamsTableProps> = ({
  streams,
  activeTab,
  onTabChange,
  onViewStream,
  onStatusChange
}) => {
  const formatPrice = (price: number): string => {
    return price.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredStreams = streams.filter(stream =>
    activeTab === 'completed' ? stream.status === 'completed' :
      activeTab === 'stopped' ? stream.status === 'stopped' :
        stream.status === 'running'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'stopped': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold">Streams</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['running', 'stopped', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 lg:px-4 py-2 rounded-lg capitalize transition-colors whitespace-nowrap text-sm lg:text-base ${activeTab === tab
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {tab} ({streams.filter(s =>
              tab === 'completed' ? s.status === 'completed' :
                tab === 'stopped' ? s.status === 'stopped' :
                  s.status === 'running'
            ).length})
          </button>
        ))}
      </div>

      {/* Streams List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {filteredStreams.map((stream) => (
          <div key={stream.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="font-semibold text-sm lg:text-base truncate">{stream.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs self-start ${getStatusColor(stream.status)}`}>
                    {stream.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{stream.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs lg:text-sm text-gray-400">
                  <span className="truncate">Host: {stream.host}</span>
                  <span>Price: {formatPrice(stream.price)}</span>
                  <span>Participants: {stream.participants.length}</span>
                  <span className="hidden lg:block">Created: {formatDate(stream.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-center">
                <button
                  onClick={() => onViewStream(stream)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  title="View Participants"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {(stream.status === 'running' || stream.status === 'stopped') && (
                  <>
                    {stream.status === 'running' && (
                      <button
                        onClick={() => onStatusChange(stream.id, 'stopped')}
                        className="group relative p-2 rounded-lg bg-gradient-to-tr from-yellow-500 via-yellow-400 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-md hover:shadow-yellow-300/40"
                        title="Stop Stream"
                      >
                        <Square className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                        <span className="absolute top-full mt-1 text-xs bg-black text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Stop Stream
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange(stream.id, 'completed')}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      title="Mark as Completed"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStreams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No {activeTab} streams found</p>
        </div>
      )}
    </div>
  );
};

export default StreamsTable;