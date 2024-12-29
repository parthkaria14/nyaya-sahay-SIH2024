import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitFeedback } from '@/lib/api/chat';
import { toast } from 'sonner';

interface MessageFeedbackProps {
  messageId: string;
  currentFeedback?: 'like' | 'dislike';
  onFeedbackChange: (feedback: 'like' | 'dislike') => void;
}

export function MessageFeedback({ 
  messageId, 
  currentFeedback,
  onFeedbackChange 
}: MessageFeedbackProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (feedback: 'like' | 'dislike') => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await submitFeedback(messageId, feedback);
      onFeedbackChange(feedback);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className={`${currentFeedback === 'like' ? 'text-green-500' : ''}`}
        onClick={() => handleFeedback('like')}
        disabled={isSubmitting}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${currentFeedback === 'dislike' ? 'text-red-500' : ''}`}
        onClick={() => handleFeedback('dislike')}
        disabled={isSubmitting}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}