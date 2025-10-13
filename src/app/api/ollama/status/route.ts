import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ทดสอบการเชื่อมต่อกับ Ollama
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // ตั้ง timeout 5 วินาที
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return NextResponse.json({
        online: true,
        message: 'Ollama is running',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        online: false,
        message: 'Ollama is not responding',
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Ollama status check error:', error);
    
    return NextResponse.json({
      online: false,
      message: 'Cannot connect to Ollama',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
