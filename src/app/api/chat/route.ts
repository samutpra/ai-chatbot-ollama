import { NextRequest, NextResponse } from 'next/server';
import { OllamaRequest, OllamaResponse, Message } from '@/types/chat';
import { databaseService } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
}

interface RequestBody {
  messages: ChatMessage[];
  model?: string;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'llama3.2', sessionId }: RequestBody = body;

    // แปลงรูปภาพให้เป็น base64 ที่ถูกต้อง
    const processedMessages = messages.map(msg => {
      const processedImages = msg.images?.map(imageUrl => {
        // ถ้าเป็น URL ให้ดึงรูปภาพมาแปลงเป็น base64
        if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
          // สำหรับตอนนี้ให้ข้ามรูปภาพที่มาจาก URL
          return null;
        }
        // ถ้าเป็น base64 อยู่แล้วให้ใช้เลย
        if (imageUrl.startsWith('data:image')) {
          return imageUrl;
        }
        return null;
      }).filter((img): img is string => img !== null) || [];

      return {
        role: msg.role,
        content: msg.content,
        images: processedImages
      };
    });

    const ollamaRequest: OllamaRequest = {
      model,
      messages: processedMessages,
      stream: false
    };

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error details:', errorText);
      throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
    }

    const data: OllamaResponse = await response.json();

    // บันทึก messages ลง database ถ้ามี sessionId
    if (sessionId) {
      // บันทึก user message สุดท้าย
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === 'user') {
        const userMessage: Message = {
          id: uuidv4(),
          role: 'user',
          content: lastUserMessage.content,
          timestamp: new Date(),
          imageUrl: lastUserMessage.images?.[0]
        };
        databaseService.saveMessage(sessionId, userMessage);
      }

      // บันทึก assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date()
      };
      databaseService.saveMessage(sessionId, assistantMessage);
    }

    return NextResponse.json({
      message: data.message.content,
      model: data.model,
      done: data.done
    });

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to communicate with Ollama: ${errorMessage}` },
      { status: 500 }
    );
  }
}
