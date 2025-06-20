"use client"

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import StreamsTable from './components/StreamsTable';
import CreateStreamModal from './components/CreateStreamModal';
import StreamDetailsModal from './components/StreamDetailsModal';
import LuckyDrawModal from './components/LuckyDrawModal';
import type { Stream, StreamUser, CreateStreamForm } from './types';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: '1',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and best practices for building scalable applications',
      price: 299900,
      status: 'active',
      host: 'John Doe',
      createdAt: '2025-06-20T10:00:00Z',
      participants: [
        { id: '1', name: 'Alice Johnson', upi: 'alice@paytm', joinedAt: '2025-06-20T10:15:00Z' },
        { id: '2', name: 'Bob Smith', upi: 'bob@gpay', joinedAt: '2025-06-20T10:22:00Z' },
        { id: '3', name: 'Charlie Brown', upi: 'charlie@phonepe', joinedAt: '2025-06-20T10:28:00Z' },
        { id: '4', name: 'Diana Wilson', upi: 'diana@paytm', joinedAt: '2025-06-20T10:35:00Z' },
        { id: '5', name: 'Eve Davis', upi: 'eve@gpay', joinedAt: '2025-06-20T10:42:00Z' }
      ]
    },
    {
      id: '2',
      title: 'Node.js Masterclass',
      description: 'Complete Node.js backend development course with real-world projects',
      price: 199900,
      status: 'active',
      host: 'Jane Smith',
      createdAt: '2025-06-20T11:00:00Z',
      participants: [
        { id: '6', name: 'Frank Miller', upi: 'frank@paytm', joinedAt: '2025-06-20T11:10:00Z' },
        { id: '7', name: 'Grace Lee', upi: 'grace@phonepe', joinedAt: '2025-06-20T11:18:00Z' },
        { id: '8', name: 'Henry Chen', upi: 'henry@gpay', joinedAt: '2025-06-20T11:25:00Z' }
      ]
    },
    {
      id: '5',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and best practices for building scalable applications',
      price: 299900,
      status: 'active',
      host: 'John Doe',
      createdAt: '2025-06-20T10:00:00Z',
      participants: [
        { id: '1', name: 'Alice Johnson', upi: 'alice@paytm', joinedAt: '2025-06-20T10:15:00Z' },
        { id: '2', name: 'Bob Smith', upi: 'bob@gpay', joinedAt: '2025-06-20T10:22:00Z' },
        { id: '3', name: 'Charlie Brown', upi: 'charlie@phonepe', joinedAt: '2025-06-20T10:28:00Z' },
        { id: '4', name: 'Diana Wilson', upi: 'diana@paytm', joinedAt: '2025-06-20T10:35:00Z' },
        { id: '5', name: 'Eve Davis', upi: 'eve@gpay', joinedAt: '2025-06-20T10:42:00Z' }
      ]
    },
    {
      id: '4',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and best practices for building scalable applications',
      price: 299900,
      status: 'active',
      host: 'John Doe',
      createdAt: '2025-06-20T10:00:00Z',
      participants: [
        { id: '1', name: 'Alice Johnson', upi: 'alice@paytm', joinedAt: '2025-06-20T10:15:00Z' },
        { id: '2', name: 'Bob Smith', upi: 'bob@gpay', joinedAt: '2025-06-20T10:22:00Z' },
        { id: '3', name: 'Charlie Brown', upi: 'charlie@phonepe', joinedAt: '2025-06-20T10:28:00Z' },
        { id: '4', name: 'Diana Wilson', upi: 'diana@paytm', joinedAt: '2025-06-20T10:35:00Z' },
        { id: '5', name: 'Eve Davis', upi: 'eve@gpay', joinedAt: '2025-06-20T10:42:00Z' }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'active' | 'suspended' | 'completed'>('active');
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<StreamUser | null>(null);
  const [spinRotation, setSpinRotation] = useState(0);

  const [createForm, setCreateForm] = useState<CreateStreamForm>({
    title: '',
    description: '',
    price: '',
    host: ''
  });

  const handleCreateStream = () => {
    if (!createForm.title || !createForm.description || !createForm.price || !createForm.host) {
      alert('Please fill all fields');
      return;
    }

    const newStream: Stream = {
      id: Date.now().toString(),
      title: createForm.title,
      description: createForm.description,
      price: parseFloat(createForm.price) * 100,
      status: 'active',
      host: createForm.host,
      createdAt: new Date().toISOString(),
      participants: []
    };

    setStreams(prev => [...prev, newStream]);
    setCreateForm({ title: '', description: '', price: '', host: '' });
    setShowCreateForm(false);
  };

  const handleStatusChange = (streamId: string, newStatus: 'suspended' | 'completed') => {
    setStreams(prev => 
      prev.map(stream => 
        stream.id === streamId ? { ...stream, status: newStatus } : stream
      )
    );
  };

  const spinWheel = () => {
    if (!selectedStream || selectedStream.participants.length === 0 || spinning) return;

    setSpinning(true);
    setWinner(null);
    
    const randomRotation = 1800 + Math.random() * 1800;
    setSpinRotation(prev => prev + randomRotation);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * selectedStream.participants.length);
      setWinner(selectedStream.participants[randomIndex]);
      setSpinning(false);
    }, 3000);
  };

  const totalStreams = streams.length;
  const activeStreams = streams.filter(s => s.status === 'active').length;
  const totalParticipants = streams.reduce((sum, stream) => sum + stream.participants.length, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 min-w-0">
        <Header onCreateStream={() => setShowCreateForm(true)} />

        <StatsCards 
          totalStreams={totalStreams}
          activeStreams={activeStreams}
          totalParticipants={totalParticipants}
        />

        <StreamsTable
          streams={streams}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onViewStream={setSelectedStream}
          onStatusChange={handleStatusChange}
        />
      </div>

      <CreateStreamModal
        isOpen={showCreateForm}
        form={createForm}
        onFormChange={setCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateStream}
      />

      <StreamDetailsModal
        stream={selectedStream}
        onClose={() => setSelectedStream(null)}
        onLuckyDraw={() => setShowSpinner(true)}
      />

      <LuckyDrawModal
        isOpen={showSpinner}
        stream={selectedStream}
        spinning={spinning}
        winner={winner}
        spinRotation={spinRotation}
        onClose={() => setShowSpinner(false)}
        onSpin={spinWheel}
      />
    </div>
  );
};

export default AdminDashboard;