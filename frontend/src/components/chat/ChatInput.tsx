import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslatedText } from '../shared/TranslatedText';
import { Send, Paperclip, Mic } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  input: string;
  isRecording: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRecord: () => void;
}

export function ChatInput({
  input,
  isRecording,
  onInputChange,
  onSend,
  onFileUpload,
  onRecord,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={onFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <TranslatedText text="Attach a file" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          className="flex-1"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRecord}
                className={isRecording ? 'text-red-500' : ''}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <TranslatedText 
                text={isRecording ? 'Stop recording' : 'Start recording'} 
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={onSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}