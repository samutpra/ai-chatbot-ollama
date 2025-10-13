import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';

// GET: ดึง session เฉพาะ
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = databaseService.getSession(params.id);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// DELETE: ลบ session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    databaseService.deleteSession(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
