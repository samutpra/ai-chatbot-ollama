# ฟีเจอร์เลือก AI Model

## ภาพรวม
ระบบรองรับการเลือก AI model ระหว่าง 2 models:
- **GPT-OSS 20B**: Open source GPT model with 20B parameters
- **Llama 3.2**: Meta's latest Llama model

## ฟีเจอร์ที่เพิ่มเข้ามา

### 1. Model Selector Component
- **ตำแหน่ง**: อยู่ใน header ของแอป
- **การทำงาน**: แสดง dropdown สำหรับเลือก model
- **UI**: แสดง icon และชื่อ model พร้อมคำอธิบาย

### 2. Model Types
```typescript
export type ModelType = 'gpt-oss:20b' | 'llama3.2';
```

### 3. Model Configuration
```typescript
const models = [
  {
    id: 'gpt-oss:20b',
    name: 'GPT-OSS 20B',
    description: 'Open source GPT model with 20B parameters',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'llama3.2',
    name: 'Llama 3.2',
    description: 'Meta\'s latest Llama model',
    icon: Bot,
    color: 'from-blue-500 to-cyan-500'
  }
];
```

### 4. การใช้งาน
1. **เลือก Model**: คลิกที่ปุ่ม model selector ใน header
2. **เปลี่ยน Model**: เลือก model ใหม่จาก dropdown
3. **ส่งข้อความ**: ระบบจะใช้ model ที่เลือกในการส่งข้อความ
4. **แสดง Model**: ในข้อความ AI จะแสดง model ที่ใช้

### 5. API Integration
- **Request**: ส่ง `model` parameter ไปยัง `/api/chat`
- **Response**: ใช้ model ที่เลือกในการ generate response
- **Storage**: บันทึก model ที่ใช้ในประวัติการคุย

## ไฟล์ที่เกี่ยวข้อง

### Components
- `src/components/chat/ModelSelector.tsx`: UI component สำหรับเลือก model
- `src/components/chat/ChatInterface.tsx`: อัปเดตเพื่อรองรับ model selection
- `src/components/chat/ChatMessage.tsx`: แสดง model ที่ใช้ในข้อความ

### API
- `src/app/api/chat/route.ts`: รองรับ model parameter

## การใช้งาน

### 1. เลือก Model
```typescript
const [selectedModel, setSelectedModel] = useState<ModelType>('llama3.2');
```

### 2. ส่ง Request
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    model: selectedModel
  })
});
```

### 3. แสดงใน UI
```typescript
<ModelSelector
  selectedModel={selectedModel}
  onModelChange={setSelectedModel}
  disabled={isLoading}
/>
```

## หมายเหตุ
- Model default คือ `llama3.2`
- สามารถเปลี่ยน model ได้ตลอดเวลา
- Model ที่เลือกจะถูกใช้ในการส่งข้อความถัดไป
- ระบบจะแสดง model ที่ใช้ในข้อความ AI
- Model selection จะถูกเก็บใน session state
