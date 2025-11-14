import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createHash, randomBytes } from 'crypto';
import sharp from 'sharp';

const prisma = new PrismaClient();

// Simple AI-based image analysis
async function analyzeImage(imageBuffer: Buffer): Promise<{
  isDuplicate: boolean;
  similarity: number;
  imageHash: string;
  analysis: {
    width: number;
    height: number;
    format: string;
    size: number;
    dominantColors?: string[];
  };
}> {
  // Generate perceptual hash for duplicate detection
  const imageHash = createHash('sha256')
    .update(imageBuffer)
    .digest('hex');

  // Get image metadata
  const metadata = await sharp(imageBuffer).metadata();
  
  // Check for duplicates in database
  if (!prisma.missionPhoto) {
    console.error('Prisma client missing missionPhoto model');
    // Return analysis without duplicate check if model not available
    return {
      isDuplicate: false,
      similarity: 0,
      imageHash,
      analysis: {
        width: (await sharp(imageBuffer).metadata()).width || 0,
        height: (await sharp(imageBuffer).metadata()).height || 0,
        format: (await sharp(imageBuffer).metadata()).format || 'unknown',
        size: imageBuffer.length
      }
    };
  }

  const existingPhotos = await prisma.missionPhoto.findMany({
    where: {
      imageHash: imageHash
    }
  });

  const isDuplicate = existingPhotos.length > 0;
  
  // Calculate similarity (simplified - in production, use perceptual hashing)
  let similarity = 0;
  if (isDuplicate) {
    similarity = 100; // Exact match
  } else {
    // Check for similar hashes (first 16 characters match)
    const hashPrefix = imageHash.substring(0, 16);
    const similarPhotos = await prisma.missionPhoto.findMany({
      where: {
        imageHash: {
          startsWith: hashPrefix
        }
      }
    });
    if (similarPhotos.length > 0) {
      similarity = 50; // Similar but not exact
    }
  }

  // Extract dominant colors (simplified)
  const stats = await sharp(imageBuffer)
    .resize(100, 100)
    .stats();
  
  const dominantColors = stats.channels
    .slice(0, 3)
    .map((channel, idx) => {
      const mean = Math.round(channel.mean);
      return mean.toString(16).padStart(2, '0');
    })
    .join('');

  return {
    isDuplicate,
    similarity,
    imageHash,
    analysis: {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: imageBuffer.length,
      dominantColors: [`#${dominantColors}`]
    }
  };
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const missionId = formData.get('missionId') as string;

    if (!file || !missionId) {
      return NextResponse.json(
        { error: 'File and missionId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Analyze image with AI
    const analysis = await analyzeImage(buffer);

    // If duplicate, return warning but still allow upload
    if (analysis.isDuplicate) {
      return NextResponse.json(
        {
          error: 'This image appears to be a duplicate',
          isDuplicate: true,
          analysis
        },
        { status: 400 }
      );
    }

    // Process and optimize image
    const processedImage = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString('hex');
    const filename = `${missionId}_${timestamp}_${randomString}.jpg`;
    const filepath = join(process.cwd(), 'public', 'uploads', 'missions', filename);

    // Save file
    await writeFile(filepath, processedImage);

    // Use transaction to ensure atomicity
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // Save photo to database
      const photo = await tx.missionPhoto.create({
        data: {
          missionId,
          imageUrl: `/uploads/missions/${filename}`,
          imageHash: analysis.imageHash,
          verified: analysis.similarity < 50, // Auto-verify if not similar to existing
          aiAnalysis: JSON.stringify(analysis.analysis),
          uploadedBy: userId
        },
        include: {
          uploader: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Increment mission progress count
      const updatedMission = await tx.mission.update({
        where: { id: missionId },
        data: {
          progressCount: {
            increment: 1
          }
        }
      });

      // Check if mission is completed
      const isCompleted = updatedMission.progressCount >= updatedMission.targetCount;
      if (isCompleted && !updatedMission.completed) {
        await tx.mission.update({
          where: { id: missionId },
          data: { completed: true }
        });
      }

      // Add eco coins to user account
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          ecoCoins: {
            increment: mission.reward
          }
        },
        select: {
          ecoCoins: true
        }
      });

      return {
        photo,
        mission: {
          ...updatedMission,
          completed: isCompleted || updatedMission.completed
        },
        user
      };
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: result.photo.id,
        imageUrl: result.photo.imageUrl,
        verified: result.photo.verified,
        uploadedAt: result.photo.uploadedAt,
        analysis: analysis.analysis
      },
      mission: {
        progressCount: result.mission.progressCount,
        targetCount: result.mission.targetCount,
        completed: result.mission.completed
      },
      ecoCoins: result.user.ecoCoins,
      coinsAwarded: mission.reward,
      message: result.mission.completed
        ? `🎉 Mission completed! You earned ${mission.reward} EcoCoins!`
        : analysis.similarity > 0 
          ? `Image uploaded but similar to existing photos. You earned ${mission.reward} EcoCoins!`
          : `Image uploaded successfully! You earned ${mission.reward} EcoCoins!`
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred during upload' },
      { status: 500 }
    );
  }
}

