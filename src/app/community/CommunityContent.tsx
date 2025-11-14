'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

type Tag = 'solo' | 'outdoor' | 'indoor' | 'women' | 'food' | 'shopping' | 'photography' | 'local' | 'luxury' | 'adventure';

interface Group {
  name: string;
  members: string;
  description: string;
  icon: string;
  tags: Tag[];
}

export default function CommunityContent() {
  const router = useRouter();
  const allGroups: Group[] = [
    {
      name: 'Solo Travelers',
      members: '1.2k members',
      description: 'For those exploring Dubai on their own',
      icon: '👤',
      tags: ['solo', 'adventure', 'outdoor']
    },
    {
      name: 'Eco-Foodies',
      members: '850 members',
      description: 'Discover sustainable dining options',
      icon: '🍽️',
      tags: ['food', 'indoor']
    },
    {
      name: 'Adventure Seekers',
      members: '2.3k members',
      description: 'Outdoor activities with minimal environmental impact',
      icon: '🌄',
      tags: ['adventure', 'outdoor']
    },
    {
      name: 'Luxury Green Stays',
      members: '640 members',
      description: 'Eco-luxury hotels and resorts',
      icon: '🏨',
      tags: ['luxury', 'indoor']
    },
    {
      name: 'Photography Enthusiasts',
      members: '1.7k members',
      description: 'Capture Dubai\'s sustainable beauty',
      icon: '📸',
      tags: ['photography', 'outdoor', 'indoor']
    },
    {
      name: 'Local Experts',
      members: '980 members',
      description: 'Get insider tips from Dubai residents',
      icon: '🏠',
      tags: ['local', 'shopping', 'food']
    },
    {
      name: 'Women Travelers',
      members: '1.5k members',
      description: 'A safe space for women travelers in Dubai',
      icon: '👩',
      tags: ['women', 'solo']
    },
    {
      name: 'Sustainable Shopping',
      members: '720 members',
      description: 'Eco-friendly shopping destinations',
      icon: '🛍️',
      tags: ['shopping', 'indoor']
    }
  ];

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const availableTags: Tag[] = ['solo', 'outdoor', 'indoor', 'women', 'food', 'shopping', 'photography', 'local', 'luxury', 'adventure'];

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredGroups = selectedTags.length === 0 
    ? allGroups 
    : allGroups.filter(group => 
        selectedTags.some(tag => group.tags.includes(tag))
      );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Join Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Connect with Eco-Conscious Travelers
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Share experiences, tips, and discover new green spots together.
            </p>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="ml-2 text-sm text-green-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {selectedTags.length > 0 && (
              <p className="text-sm text-gray-500 mb-6">
                Showing groups matching: {selectedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
              </p>
            )}

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group, index) => (
                <div key={index} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{group.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            {group.members}
                          </p>
                          <h3 className="mt-1 text-xl font-semibold text-gray-900">
                            {group.name}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-3 text-base text-gray-500 mb-3">
                        {group.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {group.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => router.push(`/community/chat/${group.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Join Group
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
