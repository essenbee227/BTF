// src/app/map/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MapClient from '@/components/MapClient';

export default async function MapPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-8">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Discover</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Dubai's Eco-Friendly Hotspots
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore sustainable locations across the city with our interactive map
            </p>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96">
              <MapClient />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}