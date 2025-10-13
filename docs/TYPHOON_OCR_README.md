# การเพิ่ม Typhoon OCR 7B Model

## ภาพรวม
เพิ่ม SCB's Typhoon OCR 7B model เข้าไปในระบบ AI Chat Assistant

## Model Details

### Typhoon OCR 7B
- **Model ID**: `scb10x/typhoon-ocr-7b:latest`
- **Description**: SCB's OCR model for Thai language
- **Size**: ~16.6 GB
- **Family**: Qwen25VL
- **Quantization**: F16
- **Status**: ✅ ทำงานได้

## การเปลี่ยนแปลง

### 1. อัปเดต Model Type
```typescript
// ก่อน
export type ModelType = 'gpt-oss:20b' | 'llama3.2:latest' | 'gemma3:27b';

// หลัง
export type ModelType = 'gpt-oss:20b' | 'llama3.2:latest' | 'gemma3:27b' | 'scb10x/typhoon-ocr-7b:latest';
```

### 2. เพิ่ม Model Configuration
```typescript
{
  id: 'scb10x/typhoon-ocr-7b:latest' as ModelType,
  name: 'Typhoon OCR 7B',
  description: 'SCB\'s OCR model for Thai language',
  icon: Bot,
  color: 'from-orange-500 to-red-500'
}
```

### 3. อัปเดต Default Model
```typescript
// เปลี่ยน default model เป็น Typhoon OCR
const [selectedModel, setSelectedModel] = useState<ModelType>('scb10x/typhoon-ocr-7b:latest');
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

### 3. Gemma 3 27B
- **Model ID**: `gemma3:27b`
- **Size**: ~17.4 GB
- **Status**: ✅ ทำงานได้

### 4. Typhoon OCR 7B (ใหม่)
- **Model ID**: `scb10x/typhoon-ocr-7b:latest`
- **Size**: ~16.6 GB
- **Status**: ✅ ทำงานได้

## การทดสอบ

### ทดสอบ Typhoon OCR 7B
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"สวัสดีครับ"}],"model":"scb10x/typhoon-ocr-7b:latest"}'
```

### ผลลัพธ์ที่ได้
```json
{
  "model": "scb10x/typhoon-ocr-7b:latest",
  "created_at": "2025-08-07T04:18:41.364717Z",
  "message": {
    "role": "assistant",
    "content": "{\"text\": \"สวัสดีครับ\"}"
  },
  "done": false
}
```

## ฟีเจอร์พิเศษ

### 1. Thai Language Support
- รองรับภาษาไทยได้ดี
- เหมาะสำหรับ OCR และการประมวลผลข้อความไทย
- ให้ผลลัพธ์ในรูปแบบ JSON

### 2. OCR Capabilities
- ออกแบบมาสำหรับ OCR
- รองรับการอ่านและประมวลผลรูปภาพ
- เหมาะสำหรับการประมวลผลเอกสาร

### 3. SCB Integration
- พัฒนาโดย SCB
- เหมาะสำหรับการใช้งานในประเทศไทย
- รองรับบริบททางธุรกิจ

## การใช้งาน

### 1. เลือก Model
- คลิกที่ dropdown ใน header
- เลือก "Typhoon OCR 7B"
- ระบบจะใช้ model นี้ในการตอบกลับ

### 2. ส่งข้อความภาษาไทย
- พิมพ์ข้อความภาษาไทย
- Model จะตอบกลับเป็นภาษาไทย
- ผลลัพธ์อาจเป็นในรูปแบบ JSON

### 3. OCR Features
- อัปโหลดรูปภาพที่มีข้อความ
- Model จะอ่านและประมวลผลข้อความ
- เหมาะสำหรับการอ่านเอกสาร

## หมายเหตุ
- Typhoon OCR เป็น model ที่มีขนาดใหญ่ (~16.6 GB)
- เหมาะสำหรับการประมวลผลภาษาไทย
- รองรับ OCR และการอ่านข้อความ
- พัฒนาโดย SCB สำหรับใช้งานในประเทศไทย
