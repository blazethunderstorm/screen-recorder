import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Get user profile with stats
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get video stats
    const videoStats = await prisma.video.aggregate({
      where: { 
        userId: id,
        // Only count public videos if not the user's own profile
        ...(session?.user?.id !== id && { visibility: 'public' }),
      },
      _sum: {
        views: true,
      },
    });

    const userProfile = {
      ...user,
      stats: {
        totalVideos: user._count.videos,
        totalViews: videoStats._sum.views || 0,
      },
    };

    // Remove email if not own profile
    if (session?.user?.id !== id) {
        (userProfile as { email?: string }).email = undefined;
      }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.id !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}