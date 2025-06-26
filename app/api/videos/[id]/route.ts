import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/videos/[id] - Get a specific video
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    const video = await prisma.video.findUnique({
      where: { id },
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

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user can access this video
    const canAccess = 
      video.visibility === 'public' || 
      (session?.user && session.user.id === video.userId);

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to view this video' },
        { status: 403 }
      );
    }

    // Increment view count if user is not the owner
    if (!session?.user || session.user.id !== video.userId) {
      await prisma.video.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

// PUT /api/videos/[id] - Update a video
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user owns this video
    if (video.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this video' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, visibility } = body;

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(visibility && { visibility }),
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

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE /api/videos/[id] - Delete a video
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user owns this video
    if (video.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this video' },
        { status: 403 }
      );
    }

    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}