import { NextRequest } from 'next/server';
import { OllamaRequest } from '@/types/chat';

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
    const { messages, model = 'llama3.2' }: RequestBody = body;

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
      stream: true
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

    // ส่ง stream response กลับไป
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // ส่งข้อมูลไปยัง client
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat stream API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to communicate with Ollama: ${errorMessage}` }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
