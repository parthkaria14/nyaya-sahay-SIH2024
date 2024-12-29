import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Download, Copy, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage, Template } from '@/types/chat';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '@/lib/translation';
import { useAtomValue } from 'jotai';
import { currentLanguageAtom } from '@/lib/translation';
import { TextReveal } from '@/components/animations/TextReveal';

interface ChatBubbleProps {
  message: ChatMessage;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
  handleDocumentClick?: (url: string) => void;
  isLoading?: boolean;
  isAnswerLoading?: boolean; // Track if answer is loading
}

// WhatsApp-style typing indicator
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3"
  >
    <Avatar className="h-6 w-6">
      <AvatarImage src="ai.png" alt="AI Assistant" />
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>

    <div className="bg-blue-500/10 rounded-lg p-4 max-w-[80%]">
      <div className="flex items-center space-x-2">
        <motion.span
          className="w-2 h-2 rounded-full bg-[#FBAC1B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 0 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-[#FBAC1B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2, repeatDelay: 0 }}
        />
        <motion.span
          className="w-2 h-2 rounded-full bg-[#FBAC1B]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4, repeatDelay: 0 }}
        />
      </div>
    </div>  
  </motion.div>
);

const FeedbackButtons = ({ 
  message, 
  onFeedback, 
  isLoading 
}: { 
  message: ChatMessage; 
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
  isLoading: boolean;
}) => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(message.feedback || null);

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (onFeedback) {
      setFeedback(type);
      onFeedback(message.id, type);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-5 w-5 ${
          feedback === 'like' 
            ? 'text-green-500 bg-green-50' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => handleFeedback('like')}
        disabled={isLoading || feedback === 'dislike'}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-5 w-5 ${
          feedback === 'dislike' 
            ? 'text-red-500 bg-red-50' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => handleFeedback('dislike')}
        disabled={isLoading || feedback === 'like'}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
};

export function ChatBubble({ 
  message, 
  onFeedback, 
  handleDocumentClick,
  isLoading = false,
  isAnswerLoading = false // Set the initial state for answer loading
}: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(message.content);
  const { t } = useTranslation();
  const currentLang = useAtomValue(currentLanguageAtom);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const showLoadingIndicator = isLoading || isTranslating || isAnswerLoading;

  useEffect(() => {
    const translateMessage = async () => {
      setIsTranslating(true);
      try {
        const translated = await translateText(message.content, currentLang);
        setTranslatedContent(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedContent(message.content);
      } finally {
        setIsTranslating(false);
      }
    };

    translateMessage();
  }, [message.content, currentLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedContent);
      toast.success(t('message_copied'));
    } catch (error) {
      toast.error(t('copy_failed'));
    }
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (onFeedback) {
      onFeedback(message.id, type);
      
      // Animate the button
      const button = document.getElementById(`feedback-${type}-${message.id}`);
      if (button) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 200);
      }
      
      toast.success(t(type === 'like' ? 'feedback_positive' : 'feedback_negative'));
    }
  };

  const handleDownload = (template: Template) => {
    if (!template?.url) {
      toast.error(t('download_link_not_available')); // Translate toast message
      return;
    }

    try {
      if (handleDocumentClick) {
        handleDocumentClick(template.url);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(t('download_failed')); // Translate toast message
    }
  };

  const truncatedContent = translatedContent.slice(0, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${
        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <Avatar className="h-6 w-6">
        {message.sender === 'bot' ? (
          <>
            <AvatarImage src="ai.png" alt="AI Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={`max-w-[80%] rounded-lg p-2 ${
          message.sender === 'user'
            ? 'bg-[#FBAC1B] text-white'
            : 'bg-[#FBAC1B] text-foreground'
        }`}
      >
        {isLoading ? (
          <TypingIndicator />
        ) : (
          <TextReveal>
            <p className="whitespace-pre-wrap text-xs">
              {isExpanded ? translatedContent : truncatedContent}
              {translatedContent.length > 100 && (
                <Button
                  variant="link"
                  className="text-[#fff] p-0 ml-1 text-[10px]"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? t('view_less') : t('read_more')}
                </Button>
              )}
            </p>
          </TextReveal>
        )}

        {/* Display message like "Enter CAPTCHA" or "Enter Answer" */}
        {message.type === 'captcha' && (
          <div className="mt-2 bg-[#FBAC1B] text-blue-800 p-2 rounded-lg">
            <p>{t('enter_captcha')}</p> {/* Translate "Enter CAPTCHA" */}
          </div>
        )}

        {message.type === 'answer' && (
          <div className="mt-2 bg-green-50 text-green-800 p-2 rounded-lg">
            <p>{t('enter_answer')}</p> {/* Translate "Enter Answer" */}
          </div>
        )}

        {/* Render CAPTCHA Image */}
        {message.captcha && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Paperclip className="h-4 w-4" />
              <span>{t('captcha')}</span> {/* Translate CAPTCHA label */}
            </div>
            <img
              src={`data:image/png;base64,${message.captcha}`}
              alt="CAPTCHA"
              className="max-w-full rounded"
            />
          </div>
        )}

        {/* Render Attachment */}
        {message.attachment && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Paperclip className="h-4 w-4" />
              <span>{message.attachment.name}</span>
            </div>
            {message.attachment.type.startsWith('image/') && (
              <img
                src={message.attachment.url}
                alt="attachment"
                className="max-w-full rounded"
              />
            )}
          </div>
        )}

        {/* Render Templates */}
        {message.templates && message.templates.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.templates.map((template) => (
              <Button
                key={template.id}
                variant="secondary"
                size="sm"
                className="w-full text-left flex items-center gap-2 hover:bg-[#FBAC1B]/80 text-[10px]"
                onClick={() => handleDownload(template)}
              >
                <Download className="h-3 w-3" />
                <span className="truncate">{template.name}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Render Case Status Results */}
        {message.caseStatus && (
          <div className="mt-2 space-y-1 bg-[#FBAC1B] p-2 rounded-lg">
            <h3 className="text-xs font-semibold">{t('case_status')}</h3> {/* Translate case status label */}
            <p className="text-xs">{message.caseStatus}</p>
          </div>
        )}

        {/* Update feedback buttons section to consider both loading states */}
        {message.sender === 'bot' && !isLoading && (
          <div className="mt-2 flex items-center gap-2 text-[10px]">
            <motion.div
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-500 hover:text-gray-700"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                id={`feedback-like-${message.id}`}
                variant="ghost"
                size="icon"
                className={`h-5 w-5 transition-colors duration-200 ${
                  message.feedback === 'like' 
                    ? 'text-green-500 bg-green-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleFeedback('like')}
                disabled={message.feedback === 'dislike' || isAnswerLoading}
              >
                <motion.div
                  animate={message.feedback === 'like' ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ThumbsUp className="h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                id={`feedback-dislike-${message.id}`}
                variant="ghost"
                size="icon"
                className={`h-5 w-5 transition-colors duration-200 ${
                  message.feedback === 'dislike' 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleFeedback('dislike')}
                disabled={message.feedback === 'like' || isAnswerLoading}
              >
                <motion.div
                  animate={message.feedback === 'dislike' ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <ThumbsDown className="h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
