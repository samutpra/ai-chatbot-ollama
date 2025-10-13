# การแก้ไข Model Issues

## ปัญหาที่เกิดขึ้น
1. **Bad Request Error**: Ollama API ส่งกลับ "Bad Request" เมื่อใช้ model ที่ไม่มี
2. **Model Not Found**: Model `llama3.2` ไม่มีใน Ollama server
3. **Error Handling**: ไม่มี error details ที่ชัดเจน

## การแก้ไข

### 1. สร้าง API Route สำหรับดึง Models
```typescript
// src/app/api/models/route.ts
export async function GET() {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  // ดึงรายการ models ที่มีใน Ollama
}
```

### 2. อัปเดต Model Names
```typescript
// ก่อน
export type ModelType = 'gpt-oss:20b' | 'llama3.2';

// หลัง
export type ModelType = 'gpt-oss:20b' | 'llama3.2:latest';
```

### 3. เพิ่ม Error Handling
```typescript
// src/app/api/chat/route.ts
if (!response.ok) {
  const errorText = await response.text();
  console.error('Ollama API error details:', errorText);
  throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
}
```

### 4. สร้าง Model Status Component
```typescript
// src/components/chat/ModelStatus.tsx
export const ModelStatus = () => {
  // แสดงรายการ models ที่ติดตั้งแล้ว
  // แสดงขนาดไฟล์และวันที่แก้ไข
}
```

### 5. อัปเดต ModelSelector
```typescript
// src/components/chat/ModelSelector.tsx
const fetchAvailableModels = async () => {
  // ดึงรายการ models ที่มีอยู่จริง
  // กรองเฉพาะ models ที่ติดตั้งแล้ว
};
```

## Models ที่รองรับ

### 1. GPT-OSS 20B
- **Model ID**: `gpt-oss:20b`
- **Description**: Open source GPT model with 20B parameters
- **Size**: ~13.8 GB
- **Status**: ✅ ทำงานได้

### 2. Llama 3.2
- **Model ID**: `llama3.2:latest`
- **Description**: Meta's latest Llama model
- **Size**: ~2 GB
- **Status**: ✅ ทำงานได้

## การทดสอบ

### 1. ทดสอบ GPT-OSS 20B
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gpt-oss:20b"}'
```

### 2. ทดสอบ Llama 3.2
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"llama3.2:latest"}'
```

### 3. ทดสอบ Models API
```bash
curl -X GET http://localhost:3000/api/models
```

## ฟีเจอร์ใหม่

### 1. Dynamic Model Detection
- ระบบจะดึงรายการ models จาก Ollama server
- แสดงเฉพาะ models ที่ติดตั้งแล้ว
- อัปเดตอัตโนมัติเมื่อมีการติดตั้ง model ใหม่

### 2. Better Error Handling
- แสดง error details ที่ชัดเจน
- จัดการกรณี model ไม่มีอยู่
- แสดงข้อความแนะนำเมื่อไม่มี models

### 3. Model Status UI
- แสดงรายการ models ที่ติดตั้ง
- แสดงขนาดไฟล์และวันที่แก้ไข
- ปุ่มรีเฟรชสำหรับอัปเดตรายการ

## ผลลัพธ์
- ✅ แก้ไข Bad Request error
- ✅ รองรับ models ที่มีอยู่จริง
- ✅ Error handling ที่ดีขึ้น
- ✅ UI ที่แสดง models ที่ใช้ได้
- ✅ Dynamic model detection

## หมายเหตุ
- ตรวจสอบ Ollama server ว่ามี models ที่ต้องการ
- ใช้ `ollama list` เพื่อดูรายการ models
- ติดตั้ง models ด้วย `ollama pull <model-name>`
