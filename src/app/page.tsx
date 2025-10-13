import { ChatInterface } from '@/components/chat/ChatInterface';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ChatInterface />
      <Toaster />
    </main>
  );
}
