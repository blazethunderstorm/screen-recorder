import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Visibility } from '@/generated/prisma';

// GET /api/videos - Get user's videos or public videos
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const visibility = searchParams.get('visibility') as Visibility | null;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause: any = {};

    // If user is authenticated and requesting their own videos
    if (session?.user && userId === session.user.id) {
      whereClause.userId = userId;
      if (visibility) {
        whereClause.visibility = visibility;
      }
    } else {
      // Only show public videos for non-authenticated users or other users
      whereClause.visibility = 'public';
      if (userId) {
        whereClause.userId = userId;
      }
    }

    const videos = await prisma.video.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.video.count({ where: whereClause });

    return NextResponse.json({
      videos,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video
// POST /api/videos - Create a new video
export async function POST(request: NextRequest) {
    try {
      const session = await auth();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized or missing user ID' },
          { status: 401 }
        );
      }
  
      const body = await request.json();
      const { title, description, videoUrl, videoId, thumbnailUrl, visibility, duration } = body;
  
      // Validate required fields
      if (!title || !videoUrl || !videoId || !thumbnailUrl) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
  
      const video = await prisma.video.create({
        data: {
          title,
          description: description || '',
          videoUrl,
          videoId,
          thumbnailUrl,
          visibility: visibility || 'private',
          duration: duration || null,
          userId: session.user.id, // Now TypeScript knows this is safe
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
  
      return NextResponse.json(video, { status: 201 });
    } catch (error) {
      console.error('Error creating video:', error);
      return NextResponse.json(
        { error: 'Failed to create video' },
        { status: 500 }
      );
    }
  }
  