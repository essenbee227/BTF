import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json(
        { error: 'photoId is required' },
        { status: 400 }
      );
    }

    // Get the photo with mission info
    const photo = await prisma.missionPhoto.findUnique({
      where: { id: photoId },
      include: {
        mission: true
      }
    });

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user owns the photo or the mission
    if (photo.uploadedBy !== userId && photo.mission.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this photo' },
        { status: 403 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // Delete photo from database
      await tx.missionPhoto.delete({
        where: { id: photoId }
      });

      // Decrement mission progress count
      const updatedMission = await tx.mission.update({
        where: { id: photo.missionId },
        data: {
          progressCount: {
            decrement: 1
          }
        }
      });

      // Ensure progress count doesn't go below 0
      if (updatedMission.progressCount < 0) {
        await tx.mission.update({
          where: { id: photo.missionId },
          data: { progressCount: 0 }
        });
        updatedMission.progressCount = 0;
      }

      // If mission was completed, check if it should still be completed
      if (updatedMission.completed && updatedMission.progressCount < updatedMission.targetCount) {
        await tx.mission.update({
          where: { id: photo.missionId },
          data: { completed: false }
        });
        updatedMission.completed = false;
      }

      // Remove eco coins from user account (refund)
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          ecoCoins: {
            decrement: photo.mission.reward
          }
        },
        select: {
          ecoCoins: true
        }
      });

      // Ensure eco coins don't go below 0
      if (user.ecoCoins < 0) {
        await tx.user.update({
          where: { id: userId },
          data: { ecoCoins: 0 }
        });
        user.ecoCoins = 0;
      }

      return {
        mission: {
          ...updatedMission,
          completed: updatedMission.completed && updatedMission.progressCount >= updatedMission.targetCount
        },
        user
      };
    });

    // Delete the file from filesystem
    try {
      const filepath = join(process.cwd(), 'public', photo.imageUrl);
      await unlink(filepath);
    } catch (fileError) {
      // File might not exist, log but don't fail
      console.warn('Could not delete file:', photo.imageUrl, fileError);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
      mission: {
        progressCount: result.mission.progressCount,
        targetCount: result.mission.targetCount,
        completed: result.mission.completed
      },
      ecoCoins: result.user.ecoCoins,
      coinsRefunded: photo.mission.reward
    });
  } catch (error) {
    console.error('Photo delete error:', error);
    return NextResponse.json(
      { error: 'An error occurred during deletion' },
      { status: 500 }
    );
  }
}

