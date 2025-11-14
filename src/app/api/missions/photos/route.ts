import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const missionId = searchParams.get('missionId');

    if (!missionId) {
      return NextResponse.json(
        { error: 'missionId is required' },
        { status: 400 }
      );
    }

    // Check if missionPhoto model exists (for debugging)
    if (!prisma.missionPhoto) {
      console.error('Prisma client missing missionPhoto model. Available models:', Object.keys(prisma));
      return NextResponse.json(
        { error: 'Database model not available. Please restart the server.' },
        { status: 500 }
      );
    }

    const photos = await prisma.missionPhoto.findMany({
      where: {
        missionId
      },
      include: {
        uploader: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

