# AI Chatbot Ollama - Documentation

## ภาพรวม
เอกสารทั้งหมดสำหรับ AI Chatbot Ollama project

## 📋 Product Requirements
- [PRD.md](PRD.md) - Product Requirements Document

## ไฟล์เอกสาร

### 📋 README.md
- เอกสารหลักของโปรเจค
- การติดตั้งและใช้งาน
- ฟีเจอร์หลัก

### 🗂️ Feature Documentation

#### CHAT_HISTORY_README.md
- การเพิ่มประวัติการคุยกัน
- การใช้ SQLite database
- การจัดการ sessions และ messages

#### MODEL_SELECTION_README.md
- การเลือก AI models
- การเพิ่ม models ใหม่
- การจัดการ model selection

#### MODEL_FIX_README.md
- การแก้ไขปัญหา model selection
- การแก้ไข ReferenceError
- การปรับปรุง error handling

#### GEMMA3_README.md
- การเพิ่ม Gemma 3 27B model
- การทดสอบ model ใหม่
- การอัปเดต UI

#### STREAM_FIX_README.md
- การแก้ไข streaming response
- การแก้ไข base64 error
- การปรับปรุง real-time updates

#### UI_IMPROVEMENT_README.md
- การปรับปรุง UI ของ chat messages
- การเพิ่ม padding และ rounded corners
- การปรับปรุง visual design

#### DROPDOWN_IMPROVEMENT_README.md
- การเปลี่ยน model selection เป็น dropdown
- การใช้ Shadcn/ui Select component
- การปรับปรุง accessibility

#### TYPHOON_OCR_README.md
- การเพิ่ม Typhoon OCR 7B model
- การรองรับภาษาไทย
- OCR capabilities

#### DARK_MODE_README.md
- การเพิ่ม dark mode, light mode และ auto mode
- การปรับปรุง UI components
- System theme integration

#### LM_STUDIO_UI_README.md
- การปรับปรุง UI ให้เหมือนกับ LM Studio
- JSON syntax highlighting
- Performance metrics display
- Modern layout design

#### TIMESTAMP_FIX_README.md
- แก้ไข TypeError timestamp.toLocaleTimeString
- Type safety improvements
- Error handling enhancements

#### STYLE_GUIDE_UPDATE_README.md
- อัปเดต CSS variables ตาม style guide ใหม่
- Color palette และ shadow system
- Component styling improvements

#### BUTTON_CLEANUP_README.md
- ตรวจสอบและลบปุ่มที่ใช้งานไม่ได้
- ลด unused code และ imports
- ปรับปรุง UI clarity

#### OLLAMA_STATUS_README.md
- ระบบตรวจสอบสถานะ Ollama online/offline
- Real-time monitoring และ status indicator
- Error handling และ timeout protection

#### STREAM_RESPONSE_FIX_README.md
- แก้ไขปัญหาการแสดงผลลัพท์ใน UI
- การ parse response stream ที่ถูกต้อง
- รองรับ Ollama API format

#### STATUS_BAR_REMOVAL_README.md
- ลบ panel ข้อความด้านล่างกล่อง input
- ปรับปรุง UI ให้สะอาดขึ้น
- ลดความยุ่งเหยิงของ interface

#### BOTTOM_STATUS_BAR_REMOVAL_README.md
- ลบข้อความใน Status Bar ด้านล่าง
- ลบ app version, user roles, system info
- ปรับปรุง UI ให้สะอาดและเรียบง่าย

#### INPUT_AREA_IMPROVEMENT_README.md
- ปรับปรุง input area ให้ปุ่มเป็นส่วนหนึ่งของ input box
- Unified design และ better UX
- Improved accessibility และ responsive design

### 📋 Product Documentation
- [PRD.md](PRD.md) - Product Requirements Document

### 🐛 Bug Fixes

#### BUGFIX_README.md
- การแก้ไข bugs ต่างๆ
- Error handling improvements
- Performance optimizations

## การใช้งาน

### การอ่านเอกสาร
1. เริ่มต้นที่ `README.md` สำหรับภาพรวม
2. อ่าน feature documentation ตามลำดับการพัฒนา
3. ดู bug fixes สำหรับการแก้ไขปัญหา

### การอัปเดตเอกสาร
- สร้างไฟล์ใหม่สำหรับ feature ใหม่
- อัปเดต INDEX.md เมื่อเพิ่มไฟล์ใหม่
- ใช้ชื่อไฟล์ที่ชัดเจนและอธิบายเนื้อหา

## โครงสร้างไฟล์
```
docs/
├── INDEX.md                    # ไฟล์นี้
├── README.md                   # เอกสารหลัก
├── CHAT_HISTORY_README.md      # ประวัติการคุย
├── MODEL_SELECTION_README.md   # การเลือก model
├── MODEL_FIX_README.md         # แก้ไข model issues
├── GEMMA3_README.md           # เพิ่ม Gemma 3
├── STREAM_FIX_README.md       # แก้ไข streaming
├── UI_IMPROVEMENT_README.md   # ปรับปรุง UI
├── DROPDOWN_IMPROVEMENT_README.md # ปรับปรุง dropdown
├── TYPHOON_OCR_README.md      # เพิ่ม Typhoon OCR
├── DARK_MODE_README.md        # เพิ่ม Dark Mode
├── LM_STUDIO_UI_README.md     # ปรับปรุง UI
├── TIMESTAMP_FIX_README.md    # แก้ไข timestamp bug
├── STYLE_GUIDE_UPDATE_README.md # อัปเดต style guide
├── BUTTON_CLEANUP_README.md    # ลบปุ่มที่ใช้งานไม่ได้
├── OLLAMA_STATUS_README.md     # ระบบตรวจสอบสถานะ Ollama
├── STREAM_RESPONSE_FIX_README.md # แก้ไขปัญหาการแสดงผลลัพท์
├── STATUS_BAR_REMOVAL_README.md  # ลบ panel ข้อความ
├── BOTTOM_STATUS_BAR_REMOVAL_README.md # ลบข้อความ Status Bar
├── INPUT_AREA_IMPROVEMENT_README.md    # ปรับปรุง input area
└── BUGFIX_README.md           # แก้ไข bugs
```

## หมายเหตุ
- เอกสารทั้งหมดเขียนเป็นภาษาไทย
- แต่ละไฟล์อธิบาย feature หรือ bug fix เฉพาะ
- ใช้ emoji เพื่อให้อ่านง่าย
- มี code examples และ screenshots เมื่อจำเป็น
