"use client"

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import StreamsTable from './components/StreamsTable';
import CreateStreamModal from './components/CreateStreamModal';
import StreamDetailsModal from './components/StreamDetailsModal';
import LuckyDrawModal from './components/LuckyDrawModal';
import type { Stream, StreamUser, CreateStreamForm } from './types';
import axios from 'axios';
import { BASE_URL } from '@/constants';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);

  const [activeTab, setActiveTab] = useState<'running' | 'stopped' | 'completed'>('running');
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

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/admin/stream/fetch`);
        if (response.data.success) {
          setStreams(response.data.streams);
        } else {
          setError("Failed to fetch streams.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const handleCreateStream = async () => {
    if (!createForm.title || !createForm.description || !createForm.price || !createForm.host) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/admin/stream/create`, { price: Number(createForm.price), host: createForm.host, title: createForm.title, description: createForm.description });
      if (!response.data.success) {
        alert("Try again");
        return;
      }
      const newStream = response.data.stream;

      setStreams(prev => [...prev, newStream]);
      setCreateForm({ title: '', description: '', price: '', host: '' });
      setShowCreateForm(false);
    } catch (error: any) {
      alert("Failed to create Stream");
      return;
    }

  };

  const handleStatusChange = async (streamId: string, newStatus: 'stopped' | 'completed') => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/status`, {
        streamId,
        newStatus,
      });

      if (response.data.success) {
        setStreams(prev =>
          prev.map(stream =>
            stream.id === streamId ? { ...stream, status: newStatus } : stream
          )
        );
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Status update failed:", error);
      alert("Something went wrong while updating the stream status.");
    }
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
  const activeStreams = streams.filter(s => s.status === 'running').length;
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

        {loading && (
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-400">Loading streams...</span>
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!loading && !error && <StreamsTable
          streams={streams}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onViewStream={setSelectedStream}
          onStatusChange={handleStatusChange}
        />}
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