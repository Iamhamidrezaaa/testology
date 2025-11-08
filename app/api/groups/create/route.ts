import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * ایجاد گروه درمانی جدید
 * POST /api/groups/create
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' }, 
        { status: 400 }
      );
    }

    // TherapyGroup model doesn't exist in schema
    // Returning mock group for now
    const group = {
      id: 'mock-group-id',
      name,
      description,
      createdById: session.user.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: []
    };

    return NextResponse.json({
      success: true,
      group
    });

  } catch (error) {
    console.error('Error creating therapy group:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















