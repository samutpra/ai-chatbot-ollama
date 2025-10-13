# ฟีเจอร์ประวัติการคุย (Chat History)

## ภาพรวม
ระบบประวัติการคุยใช้ SQLite database ในการเก็บข้อมูลการสนทนาทั้งหมด โดยแบ่งเป็น 2 ตารางหลัก:

### ตาราง `chat_sessions`
- `id`: รหัส session (UUID)
- `created_at`: วันที่สร้าง session
- `updated_at`: วันที่อัปเดตล่าสุด

### ตาราง `messages`
- `id`: รหัส message (UUID)
- `session_id`: รหัส session ที่ message นี้อยู่
- `role`: 'user' หรือ 'assistant'
- `content`: เนื้อหาข้อความ
- `image_url`: URL ของรูปภาพ (ถ้ามี)
- `timestamp`: เวลาที่ส่งข้อความ

## ฟีเจอร์ที่เพิ่มเข้ามา

### 1. การบันทึกการสนทนาอัตโนมัติ
- ทุกครั้งที่ส่งข้อความ ระบบจะสร้าง session ใหม่ถ้ายังไม่มี
- บันทึกทั้ง user message และ assistant response ลง database

### 2. หน้าประวัติการคุย
- แสดงรายการการสนทนาทั้งหมด
- แสดงวันที่อัปเดตล่าสุด
- สามารถคลิกเพื่อโหลดการสนทนาเก่า

### 3. การจัดการ Session
- **ปุ่ม "ประวัติ"**: เปิด/ปิด sidebar แสดงประวัติ
- **ปุ่ม "ใหม่"**: เริ่มการสนทนาใหม่
- **ปุ่ม "ล้าง"**: ล้างข้อความปัจจุบัน
- **ปุ่มลบ**: ลบ session จากประวัติ

### 4. API Endpoints

#### `GET /api/sessions`
ดึงรายการ sessions ทั้งหมด

#### `POST /api/sessions`
สร้าง session ใหม่
```json
{
  "sessionId": "uuid-string"
}
```

#### `GET /api/sessions/[id]`
ดึง session เฉพาะพร้อม messages

#### `DELETE /api/sessions/[id]`
ลบ session

#### `POST /api/chat` (อัปเดต)
เพิ่ม `sessionId` ใน request body เพื่อบันทึกการสนทนา

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
npm install better-sqlite3 @types/better-sqlite3 uuid @types/uuid
```

### 2. Database จะถูกสร้างอัตโนมัติ
ไฟล์ `chat_history.db` จะถูกสร้างใน root directory เมื่อเริ่มต้นแอป

### 3. การใช้งาน
1. เปิดแอปและเริ่มการสนทนา
2. คลิกปุ่ม "ประวัติ" เพื่อดูการสนทนาเก่า
3. คลิกที่การสนทนาเพื่อโหลดกลับมา
4. ใช้ปุ่ม "ใหม่" เพื่อเริ่มการสนทนาใหม่

## ไฟล์ที่เกี่ยวข้อง

- `src/lib/database.ts`: Database service
- `src/app/api/sessions/`: API routes สำหรับจัดการ sessions
- `src/components/chat/ChatHistory.tsx`: UI component สำหรับแสดงประวัติ
- `src/components/chat/ChatInterface.tsx`: อัปเดตเพื่อรองรับ session management

## หมายเหตุ
- Database file จะถูก ignore ใน git (เพิ่มใน .gitignore)
- ข้อมูลจะถูกเก็บในเครื่อง local เท่านั้น
- ระบบรองรับการลบ session และ message
