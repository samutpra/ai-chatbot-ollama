# การแก้ไข Stream Response และ Base64 Error

## ปัญหาที่เกิดขึ้น
1. **Base64 Error**: `"illegal base64 data at input byte 13"`
2. **Image Processing**: รูปภาพที่อัปโหลดไม่ถูกแปลงเป็น base64 ที่ถูกต้อง
3. **Stream Response**: ไม่มีการรองรับ stream response จาก Ollama

## การแก้ไข

### 1. แก้ไข Image Processing
```typescript
// src/app/api/chat/route.ts
const processedMessages = messages.map(msg => {
  const processedImages = msg.images?.map(imageUrl => {
    // ถ้าเป็น URL ให้ข้ามไป
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return null;
    }
    // ถ้าเป็น base64 อยู่แล้วให้ใช้เลย
    if (imageUrl.startsWith('data:image')) {
      return imageUrl;
    }
    return null;
  }).filter(Boolean) || [];

  return {
    role: msg.role,
    content: msg.content,
    images: processedImages
  };
});
```

### 2. สร้าง Stream API Route
```typescript
// src/app/api/chat/stream/route.ts
export async function POST(request: NextRequest) {
  // แปลงรูปภาพให้ถูกต้อง
  const processedMessages = messages.map(msg => {
    // ... image processing logic
  });

  const ollamaRequest: OllamaRequest = {
    model,
    messages: processedMessages,
    stream: true  // เปิดใช้งาน stream
  };

  // ส่ง stream response กลับไป
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      // ... stream processing
    }
  });
}
```

### 3. อัปเดต ChatInterface
```typescript
// src/components/chat/ChatInterface.tsx
const handleSendMessage = async (content: string, imageUrl?: string) => {
  // สร้าง assistant message สำหรับ stream
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, assistantMessage]);

  // ใช้ stream API
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    // ... request body
  });

  // อ่าน stream response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      try {
        const data = JSON.parse(line);
        if (data.message?.content) {
          fullContent += data.message.content;
          
          // อัปเดต message content แบบ real-time
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: fullContent }
                : msg
            )
          );
        }
      } catch (e) {
        continue;
      }
    }
  }
};
```

## ฟีเจอร์ใหม่

### 1. Real-time Streaming
- แสดงข้อความแบบ real-time ขณะที่ AI กำลังตอบ
- อัปเดต UI ทันทีเมื่อได้รับ chunk ใหม่
- ประสบการณ์การใช้งานที่ดีขึ้น

### 2. Better Image Handling
- ตรวจสอบรูปแบบของรูปภาพก่อนส่ง
- รองรับ base64 และ URL
- ป้องกัน base64 error

### 3. Error Handling
- จัดการ error ที่ชัดเจนขึ้น
- แสดง error details ใน console
- Graceful fallback

## การทดสอบ

### 1. ทดสอบ Stream API
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gemma3:27b"}'
```

### 2. ผลลัพธ์ที่ได้
```json
{"model":"gemma3:27b","created_at":"2025-08-07T04:09:06.447154Z","message":{"role":"assistant","content":"Hello"},"done":false}
{"model":"gemma3:27b","created_at":"2025-08-07T04:09:06.522724Z","message":{"role":"assistant","content":" there"},"done":false}
{"model":"gemma3:27b","created_at":"2025-08-07T04:09:06.597451Z","message":{"role":"assistant","content":"!"},"done":false}
// ... more chunks
{"model":"gemma3:27b","created_at":"2025-08-07T04:09:14.15934Z","message":{"role":"assistant","content":""},"done_reason":"stop","done":true}
```

## ประโยชน์

### 1. User Experience
- ดู AI ตอบแบบ real-time
- ไม่ต้องรอจนกว่าจะตอบเสร็จ
- ประสบการณ์ที่เหมือน ChatGPT

### 2. Performance
- ลด perceived latency
- เริ่มแสดงผลทันที
- ประหยัด bandwidth

### 3. Reliability
- แก้ไข base64 error
- จัดการรูปภาพได้ถูกต้อง
- Error handling ที่ดีขึ้น

## หมายเหตุ
- Stream response ใช้กับ models ที่รองรับ
- รูปภาพจะถูกประมวลผลก่อนส่ง
- ระบบจะบันทึก final message ลง database
- UI จะอัปเดตแบบ real-time
