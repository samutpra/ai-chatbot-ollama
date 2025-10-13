# AI Chat with Ollama

แอปพลิเคชัน AI Chat ที่ใช้ Ollama local API พร้อมความสามารถในการอัปโหลดและวิเคราะห์รูปภาพ

## คุณสมบัติ

- 💬 Chat กับ AI ผ่าน Ollama local API
- 🖼️ อัปโหลดรูปภาพเพื่อวิเคราะห์
- 🎨 UI ที่สวยงามและใช้งานง่าย
- ⚡ Real-time chat interface
- 📱 Responsive design

## การติดตั้ง

### ข้อกำหนดเบื้องต้น

1. ติดตั้ง [Node.js](https://nodejs.org/) (เวอร์ชัน 18 หรือใหม่กว่า)
2. ติดตั้ง [Ollama](https://ollama.ai/) และดาวน์โหลด model ที่ต้องการ

### ขั้นตอนการติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd ai-chat-ollama
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. รัน development server:
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## การใช้งาน

### การตั้งค่า Ollama

1. ติดตั้ง Ollama ตาม [คู่มือการติดตั้ง](https://ollama.ai/download)
2. ดาวน์โหลด model ที่ต้องการ:
```bash
ollama pull llama3.2
```

3. เริ่มต้น Ollama server:
```bash
ollama serve
```

### การใช้งานแอปพลิเคชัน

1. **การแชทปกติ**: พิมพ์ข้อความในช่องข้อความและกด Enter หรือคลิกปุ่ม Send
2. **การอัปโหลดรูปภาพ**: คลิกปุ่ม Upload และเลือกรูปภาพที่ต้องการวิเคราะห์
3. **การล้างแชท**: คลิกปุ่ม "Clear Chat" เพื่อล้างประวัติการแชท

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```env
OLLAMA_BASE_URL=http://localhost:11434
```

## โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # API route สำหรับ chat
│   │   └── upload/
│   │       └── route.ts          # API route สำหรับ upload รูปภาพ
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx     # Main chat interface
│   │   ├── ChatInput.tsx         # Input form component
│   │   └── ChatMessage.tsx       # Message display component
│   └── ui/                       # Shadcn/ui components
└── types/
    └── chat.ts                   # TypeScript types
```

## การพัฒนา

### การรัน development server
```bash
npm run dev
```

### การ build สำหรับ production
```bash
npm run build
```

### การรัน production server
```bash
npm start
```

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **AI**: Ollama Local API

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Ollama ไม่ตอบสนอง**
   - ตรวจสอบว่า Ollama server กำลังทำงานอยู่
   - ตรวจสอบ URL ใน environment variables

2. **ไม่สามารถอัปโหลดรูปภาพได้**
   - ตรวจสอบว่าโฟลเดอร์ `public/uploads` มีอยู่
   - ตรวจสอบสิทธิ์การเขียนไฟล์

3. **Model ไม่พบ**
   - ตรวจสอบว่าได้ดาวน์โหลด model ที่ต้องการแล้ว
   - รัน `ollama list` เพื่อดู models ที่มีอยู่

## License

MIT License
