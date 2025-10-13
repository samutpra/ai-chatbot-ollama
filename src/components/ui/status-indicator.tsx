'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  className?: string;
}

export const StatusIndicator = ({ className }: StatusIndicatorProps) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkOllamaStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ollama/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsOnline(data.online);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOllamaStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkOllamaStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 text-xs', className)}>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
        <span className="text-muted-foreground">Checking...</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-chart-2" />
          <span className="text-chart-2">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Offline</span>
        </>
      )}
    </div>
  );
};
