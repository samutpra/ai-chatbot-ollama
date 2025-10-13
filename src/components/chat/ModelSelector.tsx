'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export type ModelType =
  | 'gpt-oss:20b'
  | 'llama3.2:latest'
  | 'gemma3:27b'
  | 'scb10x/typhoon-ocr-7b:latest';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
}

interface ModelInfo {
  id: ModelType;
  name: string;
  description: string;
  size: string;
}

interface OllamaModel {
  name: string;
  model?: string;
  modified_at?: string;
  size?: number;
}

const defaultModels: ModelInfo[] = [
  {
    id: 'gpt-oss:20b',
    name: 'GPT-OSS 20B',
    description: 'Open source GPT model with 20B parameters',
    size: '40GB'
  },
  {
    id: 'llama3.2:latest',
    name: 'Llama 3.2',
    description: 'Latest Llama model with improved performance',
    size: '8GB'
  },
  {
    id: 'gemma3:27b',
    name: 'Gemma 3 27B',
    description: 'Google\'s Gemma 3 model with 27B parameters',
    size: '54GB'
  },
  {
    id: 'scb10x/typhoon-ocr-7b:latest',
    name: 'Typhoon OCR 7B',
    description: 'Thai language model with OCR capabilities',
    size: '14GB'
  }
];

export const ModelSelector = ({ selectedModel, onModelChange, disabled }: ModelSelectorProps) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        if (response.ok) {
          const data = await response.json();
          const modelNames = data.models?.map((model: OllamaModel) => model.name) || [];
          setAvailableModels(modelNames);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = defaultModels.filter(model => 
    availableModels.length === 0 || availableModels.includes(model.id)
  );

  const selectedModelInfo = defaultModels.find(model => model.id === selectedModel);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedModel}
        onValueChange={(value: ModelType) => onModelChange(value)}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-64 text-sm">
          <SelectValue placeholder="Select a model to load (L)">
            {selectedModelInfo ? (
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedModelInfo.name}</span>
                <span className="text-xs text-gray-500">({selectedModelInfo.size})</span>
              </div>
            ) : (
              'Select a model to load (L)'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading models...
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No models available
            </div>
          ) : (
            filteredModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-gray-500">{model.description}</span>
                  <span className="text-xs text-gray-400">{model.size}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        className="text-sm"
        disabled={disabled}
      >
        <Download className="h-4 w-4 mr-1" />
        Eject
      </Button>
    </div>
  );
};
