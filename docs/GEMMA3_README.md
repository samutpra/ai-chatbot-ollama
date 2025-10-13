# การเพิ่ม Gemma 3 27B Model

## ภาพรวม
เพิ่ม Google's Gemma 3 27B model เข้าไปในระบบ AI Chat Assistant

## Model Details

### Gemma 3 27B
- **Model ID**: `gemma3:27b`
- **Description**: Google's Gemma 3 model with 27B parameters
- **Size**: ~17.4 GB
- **Family**: Gemma 3
- **Quantization**: Q4_K_M
- **Status**: ✅ ทำงานได้

## การเปลี่ยนแปลง

### 1. อัปเดต Model Type
```typescript
// ก่อน
export type ModelType = 'gpt-oss:20b' | 'llama3.2:latest';

// หลัง
export type ModelType = 'gpt-oss:20b' | 'llama3.2:latest' | 'gemma3:27b';
```

### 2. เพิ่ม Model Configuration
```typescript
{
  id: 'gemma3:27b' as ModelType,
  name: 'Gemma 3 27B',
  description: 'Google\'s Gemma 3 model with 27B parameters',
  icon: Sparkles,
  color: 'from-green-500 to-emerald-500'
}
```

### 3. อัปเดต Default Model
```typescript
// เปลี่ยน default model เป็น Gemma 3
const [selectedModel, setSelectedModel] = useState<ModelType>('gemma3:27b');
```

## Models ที่รองรับตอนนี้

### 1. GPT-OSS 20B
- **Model ID**: `gpt-oss:20b`
- **Size**: ~13.8 GB
- **Status**: ✅ ทำงานได้

### 2. Llama 3.2
- **Model ID**: `llama3.2:latest`
- **Size**: ~2 GB
- **Status**: ✅ ทำงานได้

### 3. Gemma 3 27B (ใหม่)
- **Model ID**: `gemma3:27b`
- **Size**: ~17.4 GB
- **Status**: ✅ ทำงานได้

## การทดสอบ

### ทดสอบ Gemma 3 27B
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gemma3:27b"}'
```

### ผลลัพธ์ที่ได้
```json
{
  "message": "Hello there! 👋 \n\nHow can I help you today? Are you looking to:\n\n* **Chat?** Just want to talk about something?\n* **Get information?** Do you have a question you need answered?\n* **Brainstorm ideas?** Need help coming up with something?\n* **Write something?**  Like a story, poem, email, etc?\n* **Something else entirely?**\n\nJust let me know what you're thinking!\n\n\n\n",
  "model": "gemma3:27b",
  "done": true
}
```

## ฟีเจอร์

### 1. UI Integration
- แสดงใน ModelSelector dropdown
- มี icon และสีที่แตกต่าง
- แสดงคำอธิบายที่ชัดเจน

### 2. Dynamic Detection
- ระบบจะตรวจสอบว่า model มีอยู่จริง
- แสดงเฉพาะ models ที่ติดตั้งแล้ว
- อัปเดตอัตโนมัติ

### 3. Model Switching
- สามารถเปลี่ยนระหว่าง models ได้
- เก็บประวัติการใช้งาน
- แสดง model ที่ใช้ในข้อความ

## การใช้งาน

### 1. เลือก Model
- คลิกที่ ModelSelector ใน header
- เลือก "Gemma 3 27B" จาก dropdown
- ระบบจะใช้ model นี้ในการตอบกลับ

### 2. ดู Model ที่ใช้
- ในข้อความ AI จะแสดง "(gemma3:27b)"
- สามารถดูได้ในประวัติการคุย

### 3. เปลี่ยน Model
- เปลี่ยนได้ตลอดเวลา
- ไม่กระทบกับประวัติการคุย
- ใช้ model ใหม่ในการส่งข้อความถัดไป

## หมายเหตุ
- Gemma 3 เป็น model ที่มีขนาดใหญ่ (~17.4 GB)
- อาจใช้เวลานานในการโหลดครั้งแรก
- ต้องการ RAM ที่เพียงพอ
- แนะนำให้ใช้ GPU สำหรับประสิทธิภาพที่ดีขึ้น
