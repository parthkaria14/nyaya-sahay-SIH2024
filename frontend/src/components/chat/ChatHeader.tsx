import { Button } from '@/components/ui/button';
import { TranslatedText } from '../shared/TranslatedText';
import { Maximize2, Minimize2, MinusCircle, X } from 'lucide-react';

interface ChatHeaderProps {
  isMaximized: boolean;
  onMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export function ChatHeader({ 
  isMaximized, 
  onMaximize, 
  onMinimize, 
  onClose 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4 bg-primary/5">
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Nyay Sahay"
          className="h-8 w-8"
        />
        <div>
          <h3 className="font-semibold">
            <TranslatedText text="Nyay Sahay Assistant" />
          </h3>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="Your Legal Guide" />
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMaximize}
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMinimize}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}