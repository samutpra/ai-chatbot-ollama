export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OllamaRequest {
  model: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    images?: string[];
  }[];
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
}
