import { motion } from 'framer-motion';
import { ChatMessage } from '@/types/chat';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MessageProps {
  message: ChatMessage;
  onFeedbackChange: (messageId: string, feedback: 'like' | 'dislike') => void;
}

export function Message({ message, onFeedbackChange }: MessageProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.attachment ? (
          <div className="space-y-2">
            <p>📎 {message.attachment.name}</p>
            {message.attachment.type.startsWith('image/') && (
              <img
                src={message.attachment.url}
                alt="attachment"
                className="max-w-full rounded"
              />
            )}
          </div>
        ) : (
          <p>{message.content}</p>
        )}
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {message.sender === 'bot' && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${message.feedback === 'like' ? 'text-green-500' : ''}`}
                onClick={() => onFeedbackChange(message.id, 'like')}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${message.feedback === 'dislike' ? 'text-red-500' : ''}`}
                onClick={() => onFeedbackChange(message.id, 'dislike')}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}