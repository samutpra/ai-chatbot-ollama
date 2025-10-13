'use client';

import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to safely format timestamp
const formatTimestamp = (timestamp: Date | string): string => {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '--:--';
  }
};

interface ChatMessageProps {
  message: Message;
  model?: string;
}

// Simple JSON syntax highlighter
const highlightJSON = (text: string) => {
  if (!text.includes('{') && !text.includes('[')) {
    return text;
  }

  try {
    // Try to parse as JSON for proper formatting
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, 2);
    
    return formatted.split('\n').map((line, index) => {
      const indent = line.match(/^\s*/)?.[0] ?? '';
      const content = line.replace(/^\s*/, '');
      
      if (content === '') return <div key={index} className="h-4"></div>;
      
      const highlighted = content.replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/"([^"]+)"/g, '<span class="json-string">"$1"</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
        .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
        .replace(/\bnull\b/g, '<span class="json-null">null</span>');
      
      return (
        <div key={index} className="font-mono text-sm">
          <span className="text-gray-400">{indent}</span>
          <span dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      );
    });
  } catch {
    // If not valid JSON, return as plain text
    return <div className="whitespace-pre-wrap">{text}</div>;
  }
};

export const ChatMessage = ({ message, model }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex w-full gap-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex max-w-[85%] flex-col gap-2',
        isUser ? 'items-end' : 'items-start'
      )}>
        {/* Avatar */}
        <div className={cn(
          'flex items-center gap-3 mb-2',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}>
          <div className={cn(
            'p-2 rounded-full',
            isUser 
              ? 'bg-gradient-to-r from-primary to-primary' 
              : 'bg-gradient-to-r from-muted to-muted'
          )}>
            {isUser ? (
              <User className="h-4 w-4 text-primary-foreground" />
            ) : (
              <Bot className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {isUser ? 'You' : 'AI Assistant'}
            {!isUser && model && (
              <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {model}
              </span>
            )}
          </span>
        </div>

        {/* Message Content */}
        <div className={cn(
          'rounded-lg p-4 max-w-full shadow-sm',
          isUser 
            ? 'bg-gradient-to-r from-primary to-primary text-primary-foreground' 
            : 'bg-card text-card-foreground border border-border'
        )}>
          <div className="prose prose-sm max-w-none">
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed text-base">
                {message.content}
              </p>
            ) : (
              <div className="text-sm">
                {highlightJSON(message.content)}
              </div>
            )}
          </div>
        </div>
        
        {/* Image */}
        {message.imageUrl && (
          <div className="mt-2">
            <img 
              src={message.imageUrl} 
              alt="Uploaded image"
              className="w-72 h-48 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}
        
        {/* Timestamp */}
        <div className="px-2">
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
