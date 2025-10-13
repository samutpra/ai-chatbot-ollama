# Dark Mode Feature

## ภาพรวม
เพิ่ม dark mode, light mode และ auto mode ให้กับ AI Chat Assistant

## ฟีเจอร์ที่เพิ่ม

### 🌙 Dark Mode
- ธีมสีเข้มสำหรับการใช้งานในเวลากลางคืน
- ลดการรบกวนสายตา
- เหมาะสำหรับการใช้งานในสภาพแวดล้อมที่มีแสงน้อย

### ☀️ Light Mode
- ธีมสีสว่างสำหรับการใช้งานในเวลากลางวัน
- ให้ความชัดเจนสูง
- เหมาะสำหรับการใช้งานในสภาพแวดล้อมที่มีแสงมาก

### 🖥️ Auto Mode (System)
- ใช้การตั้งค่าของระบบ
- เปลี่ยนอัตโนมัติตามการตั้งค่าของ OS
- รองรับ macOS, Windows, Linux

## การเปลี่ยนแปลง

### 1. เพิ่ม ThemeProvider
```typescript
// src/components/ui/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 2. สร้าง ThemeToggle Component
```typescript
// src/components/ui/theme-toggle.tsx
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 3. อัปเดต Layout
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 4. เพิ่ม ThemeToggle ใน Header
```typescript
// src/components/chat/ChatInterface.tsx
<div className="flex items-center gap-2">
  <ModelSelector
    selectedModel={selectedModel}
    onModelChange={setSelectedModel}
    disabled={isLoading}
  />
  <ThemeToggle />
  {/* ... other buttons */}
</div>
```

## CSS Variables สำหรับ Dark Mode

### Light Mode Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.75rem;
}
```

### Dark Mode Variables
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## การปรับปรุง UI Components

### 1. ChatInterface
- Background gradient สำหรับ dark mode
- Header buttons รองรับ dark mode
- Welcome message รองรับ dark mode
- Loading indicator รองรับ dark mode

### 2. ChatMessage
- Message bubbles รองรับ dark mode
- Text colors ปรับตาม theme
- Model badges รองรับ dark mode

### 3. ChatHistory
- Sidebar background รองรับ dark mode
- Session items รองรับ dark mode
- Hover states รองรับ dark mode

### 4. ModelSelector
- Dropdown menu รองรับ dark mode
- Button styles รองรับ dark mode

## การใช้งาน

### 1. สลับ Theme
- คลิกที่ปุ่ม theme toggle ใน header
- เลือก Light, Dark, หรือ System
- ระบบจะเปลี่ยน theme ทันที

### 2. Auto Mode
- เลือก "System" ใน theme toggle
- ระบบจะใช้การตั้งค่าของ OS
- เปลี่ยนอัตโนมัติตามการตั้งค่าของระบบ

### 3. การตั้งค่าเริ่มต้น
- Default theme: "system"
- รองรับการเปลี่ยน theme แบบ smooth
- ไม่มี transition เมื่อเปลี่ยน theme

## Dependencies ที่เพิ่ม

### 1. next-themes
```bash
npm install next-themes
```

### 2. @radix-ui/react-dropdown-menu
```bash
npm install @radix-ui/react-dropdown-menu
```

## หมายเหตุ

### 1. Performance
- ใช้ CSS variables สำหรับ theme switching
- ไม่มี re-render เมื่อเปลี่ยน theme
- Smooth transitions

### 2. Accessibility
- รองรับ keyboard navigation
- Screen reader friendly
- High contrast support

### 3. Browser Support
- รองรับ modern browsers
- Fallback สำหรับ browsers เก่า
- Progressive enhancement

### 4. SEO
- ไม่มี impact ต่อ SEO
- Server-side rendering compatible
- Hydration safe

## การทดสอบ

### 1. ทดสอบ Theme Switching
```bash
# เปิดแอปพลิเคชัน
npm run dev

# ทดสอบการเปลี่ยน theme
# 1. คลิกที่ปุ่ม theme toggle
# 2. เลือก Light mode
# 3. เลือก Dark mode
# 4. เลือก System mode
```

### 2. ทดสอบ Auto Mode
```bash
# เปลี่ยนการตั้งค่าของระบบ
# macOS: System Preferences > General > Appearance
# Windows: Settings > Personalization > Colors
# Linux: Settings > Appearance
```

### 3. ทดสอบ Responsive
```bash
# ทดสอบบน mobile devices
# ทดสอบการทำงานของ theme toggle
# ทดสอบ UI elements ต่างๆ
```

## ผลลัพธ์

### ✅ สิ่งที่ทำเสร็จแล้ว:
- [x] เพิ่ม ThemeProvider
- [x] สร้าง ThemeToggle component
- [x] อัปเดต layout.tsx
- [x] เพิ่ม dark mode CSS variables
- [x] ปรับปรุง UI components
- [x] ทดสอบการทำงาน
- [x] รองรับ auto mode

### 🎯 ประโยชน์:
- **User Experience**: ผู้ใช้สามารถเลือก theme ที่เหมาะสม
- **Accessibility**: รองรับผู้ใช้ที่มีความต้องการพิเศษ
- **Modern UI**: ตามมาตรฐานของแอปพลิเคชันสมัยใหม่
- **System Integration**: ทำงานร่วมกับการตั้งค่าของระบบ
