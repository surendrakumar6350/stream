import React from 'react';
import type { CreateStreamForm } from '../types';

interface CreateStreamModalProps {
  isOpen: boolean;
  form: CreateStreamForm;
  onFormChange: (form: CreateStreamForm) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const CreateStreamModal: React.FC<CreateStreamModalProps> = ({
  isOpen,
  form,
  onFormChange,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Stream</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm lg:text-base"
              placeholder="Stream title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 h-20 text-sm lg:text-base resize-none"
              placeholder="Stream description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => onFormChange({ ...form, price: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm lg:text-base"
              placeholder="299"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Host</label>
            <input
              type="text"
              value={form.host}
              onChange={(e) => onFormChange({ ...form, host: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm lg:text-base"
              placeholder="Ankit Kumar"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors text-sm lg:text-base"
          >
            Create Stream
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStreamModal;