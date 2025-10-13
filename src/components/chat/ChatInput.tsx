'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl) return;

    onSendMessage(message, imageUrl || undefined);
    setMessage('');
    setImageUrl(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        toast.success('อัปโหลดรูปภาพเรียบร้อยแล้ว');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const removeImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Area */}
      <div className="relative">
        <div className="flex items-end gap-2 border border-border bg-input rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message to the model..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent text-foreground placeholder-muted-foreground focus:ring-0 focus:border-0 focus:outline-none"
            disabled={isUploading}
          />
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 p-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              onClick={handleSubmit}
              disabled={(!message.trim() && !imageUrl) || isUploading}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeImage}
            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
