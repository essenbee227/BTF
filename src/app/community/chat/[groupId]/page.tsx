'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ChatRoom() {
  const { groupId } = useParams();
  
  // Format the group name for display (replace hyphens with spaces and capitalize)
  const groupName = (groupId as string)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-[var(--color-cream)] rounded-lg shadow-md overflow-hidden">
          {/* Chat header */}
          <div className="bg-green-600 text-white p-4">
            <h1 className="text-xl font-bold">{groupName} Chat</h1>
            <p className="text-sm opacity-80">This is a placeholder chat room for {groupName}</p>
          </div>

          {/* Chat area */}
          <div className="h-96 p-4 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Chat functionality coming soon!</p>
          </div>

          {/* Message input (disabled) */}
          <div className="border-t p-4">
            <div className="flex opacity-50">
              <input
                type="text"
                disabled
                placeholder="Chat input will be available soon"
                className="flex-1 px-4 py-2 border rounded-l-lg bg-gray-100"
              />
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-6 py-2 rounded-r-lg cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
