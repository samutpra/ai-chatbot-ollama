import Database from 'better-sqlite3';
import path from 'path';
import { ChatSession, Message } from '@/types/chat';

const dbPath = path.join(process.cwd(), 'chat_history.db');
const db = new Database(dbPath);

// สร้างตารางถ้ายังไม่มี
const initDatabase = () => {
  // ตารางสำหรับเก็บ chat sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ตารางสำหรับเก็บ messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      image_url TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )
  `);

  // สร้าง index สำหรับการค้นหา
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
  `);
};

// เริ่มต้น database
initDatabase();

export const databaseService = {
  // สร้าง session ใหม่
  createSession: (sessionId: string): ChatSession => {
    const stmt = db.prepare(`
      INSERT INTO chat_sessions (id) VALUES (?)
    `);
    stmt.run(sessionId);

    return {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  // บันทึก message
  saveMessage: (sessionId: string, message: Message): void => {
    const stmt = db.prepare(`
      INSERT INTO messages (id, session_id, role, content, image_url, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      message.id,
      sessionId,
      message.role,
      message.content,
      message.imageUrl || null,
      message.timestamp.toISOString()
    );

    // อัปเดต updated_at ของ session
    const updateStmt = db.prepare(`
      UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    updateStmt.run(sessionId);
  },

  // ดึง session พร้อม messages
  getSession: (sessionId: string): ChatSession | null => {
    const sessionStmt = db.prepare(`
      SELECT id, created_at, updated_at FROM chat_sessions WHERE id = ?
    `);
    const session = sessionStmt.get(sessionId) as any;

    if (!session) return null;

    const messagesStmt = db.prepare(`
      SELECT id, role, content, image_url, timestamp 
      FROM messages 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `);
    const messages = messagesStmt.all(sessionId) as any[];

    return {
      id: session.id,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        imageUrl: msg.image_url,
        timestamp: new Date(msg.timestamp)
      })),
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at)
    };
  },

  // ดึงรายการ sessions ทั้งหมด
  getAllSessions: (): ChatSession[] => {
    const sessionsStmt = db.prepare(`
      SELECT id, created_at, updated_at 
      FROM chat_sessions 
      ORDER BY updated_at DESC
    `);
    const sessions = sessionsStmt.all() as any[];

    return sessions.map(session => ({
      id: session.id,
      messages: [], // ไม่ดึง messages เพื่อประหยัด memory
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at)
    }));
  },

  // ลบ session
  deleteSession: (sessionId: string): void => {
    const stmt = db.prepare('DELETE FROM chat_sessions WHERE id = ?');
    stmt.run(sessionId);
  },

  // ลบ message
  deleteMessage: (messageId: string): void => {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    stmt.run(messageId);
  }
};
