'use client';

import dynamic from 'next/dynamic';

const CommunityContent = dynamic(
  () => import('./CommunityContent'),
  { ssr: false, loading: () => <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading community...</div> }
);

export default function CommunityPageClient() {
  return <CommunityContent />;
}
