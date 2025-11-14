'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Mission {
  id?: string;
  title: string;
  description: string;
  coins: string;
  progress: string;
  progressCount?: number;
  targetCount?: number;
  completed?: boolean;
}

interface MissionPhoto {
  id: string;
  imageUrl: string;
  verified: boolean;
  uploadedAt: string;
  uploader: {
    name: string | null;
  };
}

export default function MissionCard({ mission, missionId }: { mission: Mission; missionId?: string }) {
  const [photos, setPhotos] = useState<MissionPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProgress, setCurrentProgress] = useState(mission.progress);
  const [ecoCoinsEarned, setEcoCoinsEarned] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !missionId) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('missionId', missionId);

    try {
      const response = await fetch('/api/missions/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isDuplicate) {
          setError('⚠️ This image appears to be a duplicate. Please upload a different photo.');
        } else {
          setError(data.error || 'Upload failed');
        }
        setUploading(false);
        return;
      }

      // Update progress display
      if (data.mission) {
        const progressText = data.mission.completed
          ? `✅ Completed (${data.mission.progressCount}/${data.mission.targetCount})`
          : `${data.mission.progressCount}/${data.mission.targetCount}`;
        setCurrentProgress(progressText);
      }

      // Show success message with coins earned
      if (data.coinsAwarded) {
        setEcoCoinsEarned(data.coinsAwarded);
        setSuccess(data.message || `✅ Photo uploaded! You earned ${data.coinsAwarded} EcoCoins!`);
        
        // Refresh the page after 2 seconds to show updated eco coins total
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSuccess('✅ Photo uploaded successfully!');
      }

      // Refresh photos
      fetchPhotos();
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const fetchPhotos = async () => {
    if (!missionId) return;
    
    try {
      const response = await fetch(`/api/missions/photos?missionId=${missionId}`);
      const data = await response.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo? This will also remove the progress and eco coins earned from this upload.')) {
      return;
    }

    try {
      const response = await fetch(`/api/missions/delete-photo?photoId=${photoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete photo');
        return;
      }

      setSuccess('Photo deleted successfully. Progress and eco coins have been updated.');
      
      // Update progress display
      if (data.mission) {
        const progressText = data.mission.completed
          ? `✅ Completed (${data.mission.progressCount}/${data.mission.targetCount})`
          : `${data.mission.progressCount}/${data.mission.targetCount}`;
        setCurrentProgress(progressText);
      }

      // Refresh photos
      fetchPhotos();
      
      // Refresh page after 2 seconds to show updated eco coins
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('An error occurred while deleting the photo');
    }
  };

  // Fetch photos on mount
  useEffect(() => {
    if (missionId) {
      fetchPhotos();
    }
  }, [missionId]);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">{mission.title.split(' ')[0]}</span>
            </div>
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{mission.title}</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{mission.description}</div>
                </dd>
              </dl>
            </div>
          </div>
                      <div className="ml-5 flex-shrink-0 text-right">
            <p className="text-sm font-medium text-green-600">{mission.coins}</p>
            <p className="text-xs text-gray-500">{currentProgress}</p>
            {mission.completed && (
              <p className="text-xs text-green-600 font-semibold mt-1">✓ Completed</p>
            )}
          </div>
        </div>

        {/* Photo Upload Section */}
        {missionId && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Upload Proof</h4>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`file-input-${missionId}`}
                disabled={uploading}
              />
              <label
                htmlFor={`file-input-${missionId}`}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                }`}
              >
                {uploading ? 'Uploading...' : '📷 Upload Photo'}
              </label>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800">{success}</p>
              </div>
            )}

            {/* Display Uploaded Photos */}
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={photo.imageUrl}
                        alt="Mission proof"
                        fill
                        className="object-cover"
                      />
                      {photo.verified && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded z-10">
                          ✓
                        </div>
                      )}
                      {/* Delete button - appears on hover */}
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
                        title="Delete photo"
                      >
                        <span className="text-white text-2xl font-bold">🗑️</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

