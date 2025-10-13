'use client';

import { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ChatHistoryProps {
  onSessionSelect: (session: ChatSession) => void;
  currentSessionId?: string;
}

export const ChatHistory = ({ onSessionSelect, currentSessionId }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('ไม่สามารถโหลดประวัติการคุยได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
        toast.success('ลบการสนทนาเรียบร้อยแล้ว');
      } else {
        toast.error('ไม่สามารถลบการสนทนาได้');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('ไม่สามารถลบการสนทนาได้');
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '--/--/----';
    }
  };

  const getTokenCount = (session: ChatSession) => {
    // Simulate token count based on session ID
    const hash = session.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 20 + 1;
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-sidebar">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Chats</h2>
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col items-center py-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 bg-sidebar-accent text-sidebar-accent-foreground">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p>ยังไม่มีประวัติการคุย</p>
          </div>
        ) : (
          <div className="divide-y divide-sidebar-border">
            {sessions.map((session) => {
              const tokenCount = getTokenCount(session);
              const isSelected = currentSessionId === session.id;
              
              return (
                <div
                  key={session.id}
                  className={`p-3 hover:bg-sidebar-accent cursor-pointer transition-colors ${
                    isSelected ? 'bg-sidebar-accent border-r-2 border-sidebar-primary' : ''
                  }`}
                  onClick={() => onSessionSelect(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                          {session.id.slice(0, 8)}...
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(session.createdAt)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {tokenCount}K tokens
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
