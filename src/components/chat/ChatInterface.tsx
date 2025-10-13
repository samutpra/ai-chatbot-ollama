'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatSession } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { ModelSelector, ModelType } from './ModelSelector';
import { Button } from '@/components/ui/button';
import { Trash2, Bot, Sparkles, History, Plus, Copy, Lightbulb } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [showHistory, setShowHistory] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelType>('scb10x/typhoon-ocr-7b:latest');
  const [performanceMetrics, setPerformanceMetrics] = useState({
    tokensPerSec: 0,
    totalTokens: 0,
    firstTokenTime: 0,
    stopReason: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;

    // สร้าง session ใหม่ถ้ายังไม่มี
    if (!currentSessionId) {
      const newSessionId = uuidv4();
      setCurrentSessionId(newSessionId);
      
      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: newSessionId }),
        });
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || 'Analyze this image',
      timestamp: new Date(),
      imageUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // สร้าง assistant message สำหรับ stream
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              images: msg.imageUrl ? [msg.imageUrl] : []
            })),
            {
              role: 'user',
              content: content || 'Analyze this image',
              images: imageUrl ? [imageUrl] : []
            }
          ],
          sessionId: currentSessionId,
          model: selectedModel
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullContent = '';
        let tokenCount = 0;
        let firstTokenReceived = false;
        let firstTokenTime = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                
                // ตรวจสอบ format ของ Ollama response
                if (parsed.message && parsed.message.content) {
                  const content = parsed.message.content;
                  fullContent += content;
                  tokenCount++;

                  if (!firstTokenReceived) {
                    firstTokenTime = Date.now() - startTime;
                    firstTokenReceived = true;
                  }

                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                }
                
                // ตรวจสอบว่า stream จบแล้วหรือไม่
                if (parsed.done) {
                  break;
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
                console.log('Raw line:', line);
              }
            }
          }
        }

        // อัปเดต performance metrics
        const totalTime = Date.now() - startTime;
        setPerformanceMetrics({
          tokensPerSec: Math.round((tokenCount / (totalTime / 1000)) * 100) / 100,
          totalTokens: tokenCount,
          firstTokenTime: Math.round(firstTokenTime / 100) / 10,
          stopReason: 'EOS Token Found'
        });

        // บันทึกข้อความสุดท้าย
        try {
          await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                ...messages.map(msg => ({
                  role: msg.role,
                  content: msg.content,
                  images: msg.imageUrl ? [msg.imageUrl] : []
                })),
                {
                  role: 'user',
                  content: content || 'Analyze this image',
                  images: imageUrl ? [imageUrl] : []
                },
                {
                  role: 'assistant',
                  content: fullContent,
                  images: []
                }
              ],
              sessionId: currentSessionId,
              model: selectedModel
            }),
          });
        } catch (error) {
          console.error('Error saving message:', error);
        }

      } else {
        const errorText = await response.text();
        console.error('Stream API error:', errorText);
        toast.error('ไม่สามารถส่งข้อความได้');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('ไม่สามารถส่งข้อความได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentSessionId(undefined);
    setPerformanceMetrics({
      tokensPerSec: 0,
      totalTokens: 0,
      firstTokenTime: 0,
      stopReason: ''
    });
    toast.success('ล้างการสนทนาเรียบร้อยแล้ว');
  };

  const handleSessionSelect = async (session: ChatSession) => {
    try {
      const response = await fetch(`/api/sessions/${session.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentSessionId(session.id);
        toast.success('โหลดการสนทนาเรียบร้อยแล้ว');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('ไม่สามารถโหลดการสนทนาได้');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(undefined);
    setPerformanceMetrics({
      tokensPerSec: 0,
      totalTokens: 0,
      firstTokenTime: 0,
      stopReason: ''
    });
    toast.success('เริ่มการสนทนาใหม่');
  };

  const handleCopyLastResponse = () => {
    const lastAssistantMessage = messages
      .filter(msg => msg.role === 'assistant')
      .pop();
    
    if (lastAssistantMessage?.content) {
      navigator.clipboard.writeText(lastAssistantMessage.content);
      toast.success('คัดลอกข้อความเรียบร้อยแล้ว');
    }
  };

  const handleReloadModel = () => {
    toast.info('กำลังโหลดโมเดลใหม่...');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat History */}
      {showHistory && (
        <div className="w-80 border-r border-sidebar-border bg-sidebar">
          <ChatHistory 
            onSessionSelect={handleSessionSelect}
            currentSessionId={currentSessionId}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleReloadModel}
              className="text-sm"
            >
              Reload last used model (R)
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="p-8 bg-card rounded-lg shadow-sm">
                    <div className="p-4 bg-gradient-to-r from-primary to-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      Welcome to AI Chat
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start a conversation with your AI assistant or upload an image to analyze
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
                      <span>AI is ready to help</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} model={selectedModel} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card rounded-lg p-4 shadow-sm max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-primary to-primary rounded-full">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {performanceMetrics.totalTokens > 0 && (
          <div className="border-t border-border bg-muted px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              <span>
                {performanceMetrics.tokensPerSec} tok/sec • {performanceMetrics.totalTokens} tokens • {performanceMetrics.firstTokenTime}s to first token • Stop reason: {performanceMetrics.stopReason}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {messages.length > 0 && (
          <div className="border-t border-border bg-background px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLastResponse}
                  className="text-sm"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm"
                >
                  <History className="h-4 w-4 mr-1" />
                  {showHistory ? 'Hide' : 'Show'} History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  disabled={messages.length === 0}
                  className="text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
