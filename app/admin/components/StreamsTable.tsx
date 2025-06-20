import React from 'react';
import { Eye, Square, CheckCircle } from 'lucide-react';
import type { Stream } from '../types';

interface StreamsTableProps {
  streams: Stream[];
  activeTab: 'active' | 'suspended' | 'completed';
  onTabChange: (tab: 'active' | 'suspended' | 'completed') => void;
  onViewStream: (stream: Stream) => void;
  onStatusChange: (streamId: string, newStatus: 'suspended' | 'completed') => void;
}

const StreamsTable: React.FC<StreamsTableProps> = ({
  streams,
  activeTab,
  onTabChange,
  onViewStream,
  onStatusChange
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price / 100);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredStreams = streams.filter(stream => 
    activeTab === 'completed' ? stream.status === 'completed' :
    activeTab === 'suspended' ? stream.status === 'suspended' :
    stream.status === 'active'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'suspended': return 'text-yellow-400 bg-yellow-500/20';
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
        {(['active', 'suspended', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 lg:px-4 py-2 rounded-lg capitalize transition-colors whitespace-nowrap text-sm lg:text-base ${
              activeTab === tab 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab} ({streams.filter(s => 
              tab === 'completed' ? s.status === 'completed' :
              tab === 'suspended' ? s.status === 'suspended' :
              s.status === 'active'
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
                
                {stream.status === 'active' && (
                  <>
                    <button
                      onClick={() => onStatusChange(stream.id, 'suspended')}
                      className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                      title="Suspend Stream"
                    >
                      <Square className="w-4 h-4" />
                    </button>
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