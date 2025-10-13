'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ModelInfo {
  name: string;
  size: number;
  modified_at: string;
}

interface ModelsResponse {
  models: ModelInfo[];
}

export const ModelStatus = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/models');
      if (response.ok) {
        const data: ModelsResponse = await response.json();
        setModels(data.models || []);
      } else {
        throw new Error('Failed to fetch models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('ไม่สามารถโหลดรายการ models ได้');
      toast.error('ไม่สามารถเชื่อมต่อกับ Ollama server ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">กำลังโหลดรายการ models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600 mb-2">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchModels}
          className="text-xs"
        >
          ลองใหม่
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Models ที่ติดตั้งแล้ว</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchModels}
          className="text-xs"
        >
          รีเฟรช
        </Button>
      </div>
      
      {models.length === 0 ? (
        <div className="text-center py-4">
          <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">ไม่พบ models ที่ติดตั้ง</p>
          <p className="text-xs text-gray-500 mt-1">
            ตรวจสอบ Ollama server และติดตั้ง models
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{model.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(model.size)} • {formatDate(model.modified_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
