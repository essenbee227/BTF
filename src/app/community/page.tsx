import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CommunityPageClient from './CommunityPageClient';

export default async function CommunityPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return <CommunityPageClient />;
}

