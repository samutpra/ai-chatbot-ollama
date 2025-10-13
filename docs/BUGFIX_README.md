# การแก้ไข Bug: selectedModel is not defined

## ปัญหาที่เกิดขึ้น
```
ReferenceError: selectedModel is not defined
    at handleSubmit (http://localhost:3000/_next/static/chunks/src_1f0e958c._.js:327:42)
```

## สาเหตุของปัญหา
ใน `ChatInput` component ใช้ `selectedModel` แต่ไม่ได้ส่งผ่าน props มาให้ ทำให้เกิด ReferenceError

## การแก้ไข

### 1. ลบ selectedModel จาก ChatInput
```typescript
// ก่อน
onSendMessage(message, imageUrl, selectedModel);

// หลัง
onSendMessage(message, imageUrl);
```

### 2. อัปเดต Interface
```typescript
// ก่อน
interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string, model?: ModelType) => void;
  isLoading?: boolean;
}

// หลัง
interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading?: boolean;
}
```

### 3. จัดการ Model Selection ใน ChatInterface
```typescript
// ใน ChatInterface
const handleSendMessage = async (content: string, imageUrl?: string) => {
  // ใช้ selectedModel จาก state ของ ChatInterface
  body: JSON.stringify({
    messages: [...],
    sessionId: currentSessionId,
    model: selectedModel  // ใช้ selectedModel จาก state
  })
};
```

## ผลลัพธ์
- ✅ แก้ไข ReferenceError เรียบร้อย
- ✅ Model selection ทำงานได้ปกติ
- ✅ สามารถเปลี่ยน model ได้
- ✅ API รับ model parameter ได้ถูกต้อง

## การทดสอบ
```bash
# ทดสอบ llama3.2
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"llama3.2"}'

# ทดสอบ gpt-oss:20b
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gpt-oss:20b"}'
```

## หมายเหตุ
- Model selection ถูกจัดการในระดับ ChatInterface
- ChatInput ไม่ต้องรู้เรื่อง model selection
- การแยก concerns ทำให้ code สะอาดขึ้น
