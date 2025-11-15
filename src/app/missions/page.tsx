import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MissionCard from '@/components/MissionCard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function MissionsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch or create default missions
  const defaultMissions = [
    {
      title: '🌱 Green Commute Challenge',
      description: 'Use public transport, bike, or walk instead of taxis',
      coins: '+50 EcoCoins',
      targetCount: 5,
      progressLabel: 'trips'
    },
    {
      title: '💧 Refill & Save',
      description: 'Refill your water bottle at designated stations',
      coins: '+30 EcoCoins',
      targetCount: 3,
      progressLabel: 'refills'
    },
    {
      title: '🏨 Eco Stay',
      description: 'Book a stay at a certified eco-friendly hotel',
      coins: '+100 EcoCoins',
      targetCount: 1,
      progressLabel: 'stay'
    },
    {
      title: '📸 Green Landmark Hunt',
      description: 'Visit and photograph sustainable attractions',
      coins: '+25 EcoCoins each',
      targetCount: 3,
      progressLabel: 'locations'
    },
    {
      title: '♻️ Zero Waste Day',
      description: 'Go a full day without single-use plastics',
      coins: '+75 EcoCoins',
      targetCount: 1,
      progressLabel: 'day'
    }
  ];

  // Get or create missions in database
  const userId = session.user?.id;
  if (!userId) {
    redirect('/auth/signin');
  }

  // Get user's current eco coins
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ecoCoins: true }
  });

  const missions = await Promise.all(
    defaultMissions.map(async (defaultMission) => {
      let mission = await prisma.mission.findFirst({
        where: {
          title: defaultMission.title,
          userId: userId
        }
      });

      if (!mission) {
        mission = await prisma.mission.create({
          data: {
            title: defaultMission.title,
            description: defaultMission.description,
            reward: parseInt(defaultMission.coins.replace(/\D/g, '')) || 0,
            targetCount: defaultMission.targetCount,
            userId: userId,
            completed: false,
            progressCount: 0
          }
        });
      }

      // Update targetCount if it's different (for existing missions)
      if (mission.targetCount !== defaultMission.targetCount) {
        mission = await prisma.mission.update({
          where: { id: mission.id },
          data: { targetCount: defaultMission.targetCount }
        });
      }

      const progress = mission.completed 
        ? `✅ Completed (${mission.progressCount}/${mission.targetCount} ${defaultMission.progressLabel})`
        : `${mission.progressCount}/${mission.targetCount} ${defaultMission.progressLabel}`;

      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        coins: defaultMission.coins,
        progress,
        progressCount: mission.progressCount,
        targetCount: mission.targetCount,
        completed: mission.completed
      };
    })
  );

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Earn Rewards</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Complete Missions, Earn EcoCoins
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Take on sustainability challenges and get rewarded for making a positive impact. Upload photos as proof!
            </p>
            {user && (
              <div className="mt-6">
                <div className="inline-flex items-center px-6 py-3 rounded-lg" style={{ backgroundColor: '#f5f0d8' }}>
                  <span className="text-2xl mr-2">🪙</span>
                  <span className="text-lg font-semibold text-green-800">
                    Your EcoCoins: <span className="text-green-600">{user.ecoCoins}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10">
            <div className="space-y-4">
              {missions.map((mission) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  missionId={mission.id}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

