import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  Scale,
  Send,
  Paperclip,
  Mic,
  X,
  MinusCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LoadingDots } from "./LoadingDots";
import { ChatBubble } from "./ChatBubble";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chat";
import axios from "axios";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { translateText } from '@/lib/translation'; // Import translateText
import { useAtomValue } from 'jotai';
import { currentLanguageAtom } from '@/lib/translation';

// Define the API URL (can be set via environment variables in production)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const queryTypeFeatures = [
  {
    type: "normal" as QueryType,
    icon: MessageSquare,
    label: "General Query",
    description: "Ask any legal questions",
  },
  {
    type: "templates" as QueryType,
    icon: FileText,
    label: "Templates",
    description: "Get legal document templates",
  },
  {
    type: "caseStatus" as QueryType,
    icon: Scale,
    label: "Case Status",
    description: "Check your case status",
  },
];

export function ChatInterface() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    sendMessage,
    activeQueryType,
    handleQueryTypeSelect,
    downloadDocument,
  } = useChat();

  // Show query type selector when chat is first opened
  const [showQuerySelector, setShowQuerySelector] = useState(true);

  const [cnrNumber, setCnrNumber] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const { t } = useTranslation(); // Initialize useTranslation
  const currentLang = useAtomValue(currentLanguageAtom); // Get the current language

  const handleQueryTypeSelection = (type: QueryType) => {
    handleQueryTypeSelect(type);
    setShowQuerySelector(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Translate user input to English before sending
    const translatedInput = await translateText(input, 'en');
    setInput("");
    await sendMessage(translatedInput);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('file_size_exceeds_limit')); // Translate toast message
        return;
      }
      // Handle file upload logic here
      toast.success(t('file_uploaded_successfully')); // Translate toast message
    }
  };

  const toggleRecording = async () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      toast.error(t('speech_recognition_not_supported')); // Translate toast message
      return;
    }

    try {
      if (isRecording) {
        setIsRecording(false);
        // Stop recording logic
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(true);
        toast.info(t('listening_speak_now')); // Translate toast message

        // Initialize speech recognition
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          toast.error(t('speech_recognition_error')); // Translate toast message
          setIsRecording(false);
        };

        recognition.start();
      }
    } catch (error) {
      toast.error(t('microphone_access_denied')); // Translate toast message
      setIsRecording(false);
    }
  };
  const renderMessage = (message: ChatMessage) => {
    const isBase64Image = message.content && message.content.startsWith("data:image/");
    const isBase64Text = message.content && message.content.startsWith("data:text/");
    const isBase64File = message.content && message.content.startsWith("data:application/");
  
    // Function to decode base64 text
    const decodeBase64Text = (base64Text: string) => {
      try {
        const decoded = atob(base64Text.split(",")[1]); // Remove the "data:text/plain;base64," prefix and decode
        return decoded;
      } catch (error) {
        console.error("Error decoding base64 text:", error);
        return null;
      }
    };
  
    // Function to decode base64 files
    const handleBase64File = (base64File: string) => {
      // You can further extend this to handle the file (download or preview)
      const link = document.createElement("a");
      link.href = base64File;
      link.download = "downloaded-file"; // You can customize the filename here
      link.click();
    };
  
    return (
      <div key={message.id}>
        <ChatBubble message={message} handleDocumentClick={downloadDocument} />
        
        {isBase64Image && (
          <div className="mt-2 max-w-full overflow-hidden">
            <img
              src={message.content}
              alt="Base64 Image"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}
  
        {isBase64Text && (
          <div className="mt-2 p-4 border bg-gray-100 rounded-lg shadow-sm">
            <pre>{decodeBase64Text(message.content)}</pre>
          </div>
        )}
  
        {isBase64File && (
          <div className="mt-2">
            <button
              className="bg-[#FBAC1B] text-white p-2 rounded"
              onClick={() => handleBase64File(message.content)}
            >
              Download File
            </button>
          </div>
        )}
      </div>
    );
  };
  
  

  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true);
    try {
      const response = await axios.get(`${API_URL}/`);
      if (response.data && response.data.captcha_base64) {
        setCaptchaImage(response.data.captcha_base64);
      } else {
        toast.error(t('loading_captcha_invalid_response')); // Translate toast message
      }
    } catch (error) {
      toast.error(t('loading_captcha_failed')); // Translate toast message
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  const submitCaseStatus = async () => {
    if (!cnrNumber || !captchaInput) {
      toast.error(t('please_fill_all_fields')); // Translate toast message
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cino', cnrNumber);
      formData.append('captcha', captchaInput);

      const response = await axios.post('http://127.0.0.1:8000/submit', formData);

      if (response.data.success) {
        // Send the case status as a new message in the chat
        sendMessage(`Case Status Information:\n${response.data.result}`);
        
        // Clear form inputs
        setCnrNumber('');
        setCaptchaInput('');
        await fetchCaptcha();
        
        toast.success(t('case_status_retrieved_successfully')); // Translate toast message
      }
    } catch (error) {
      toast.error(t('failed_to_fetch_case_status')); // Translate toast message
      await fetchCaptcha();
    }
  };

  useEffect(() => {
    if (activeQueryType === "caseStatus") {
      fetchCaptcha();
    }
  }, [activeQueryType]);

  const renderCaseStatusForm = () => {
    return (
      <div className="space-y-4">
        {/* CNR Input */}
        <Input
          placeholder={t('enter_cnr_number')} // Translate placeholder
          value={cnrNumber}
          onChange={(e) => setCnrNumber(e.target.value)}
          className="w-full"
        />

        {/* CAPTCHA Section - Image and Input on One Line */}
        <div className="flex items-center gap-2">
          {isCaptchaLoading ? (
            <div className="animate-spin text-gray-500">🔄</div>
          ) : captchaImage ? (
            <img
              src={`data:image/png;base64,${captchaImage}`}
              alt="CAPTCHA"
              className="h-8"
            />
          ) : (
            <span className="text-sm text-gray-400">{t('loading')}</span> // Translate loading text
          )}
          <Input
            placeholder={t('enter_captcha')} // Translate placeholder
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="flex-grow"
          />
        </div>

        {/* Reload and Submit Buttons on One Line */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCaptcha}
            className="h-8 w-8 flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={submitCaseStatus}
            disabled={!cnrNumber || !captchaInput || isCaptchaLoading}
            className="flex-grow"
          >
            {t('submit')} {/* Translate button text */}
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            setShowQuerySelector(true);
          }}
          className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg z-50 bg-[#FBAC1D]"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
  
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              height: isMinimized ? "auto" : "100%",
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={
              isMaximized
                ? "fixed inset-0 z-50"
                : "fixed bottom-4 right-4 w-[95%] md:w-[400px] z-50 max-w-full max-h-[80vh]"
            }
          >
            <Card className="overflow-hidden h-full flex flex-col shadow-lg border-none relative">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-[#FBAC1B] relative z-20">
                <div className="flex items-center gap-2">
                  <img
                    src="/src/styles/logo.png"
                    alt="Nyay Sahay"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                  <div>
                    <h3 className="font-semibold text-black text-sm sm:text-base">
                      {t('nyaya_sahay_assistant')} {/* Translate header text */}
                    </h3>
                    <p className="text-xs sm:text-sm text-brown-200">
                      {t('your_legal_guide')} {/* Translate header text */}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMaximized(!isMaximized)}
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-4 w-4 text-black" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-black" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    <MinusCircle className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4 text-black" />
                  </Button>
                </div>
              </div>
  
              {!isMinimized && (
                <div className="flex-1 flex flex-col relative z-10 max-h-[calc(80vh-4rem)]">
                  {showQuerySelector ? (
                    <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4">
                      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">
                        {t('how_can_i_help_you_today')} {/* Translate header text */}
                      </h2>
                      <div className="grid gap-3 sm:gap-4 w-full max-w-md px-2 sm:px-0">
                        {queryTypeFeatures.map((feature) => (
                          <Button
                            key={feature.type}
                            variant="outline"
                            className="flex items-center gap-3 p-3 sm:p-4 h-auto text-left"
                            onClick={() => handleQueryTypeSelection(feature.type)}
                          >
                            <feature.icon className="h-5 w-5 sm:h-6 sm:h-6 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate">
                                {t(feature.label)} {/* Translate feature label */}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {t(feature.description)} {/* Translate feature description */}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 px-3 sm:px-4 pt-3 sm:pt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        style={{ maxHeight: "calc(80vh - 13rem)" }}
                      >
                        <div className="space-y-3 sm:space-y-4">
                          {messages.map(renderMessage)}
                          {isLoading && <LoadingDots />}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
  
                      {/* Conditionally render CaseStatusForm */}
                      {activeQueryType === "caseStatus" && (
                        <div className="px-3 sm:px-4">
                          {renderCaseStatusForm()}
                        </div>
                      )}
  
                      <div className="relative z-10 bg-from-[#FBAC1B] to-transparent py-3 sm:py-4">
                        <div className="px-3 sm:px-4 mb-2">
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {queryTypeFeatures.map((feature) => (
                              <Button
                                key={feature.type}
                                variant={
                                  activeQueryType === feature.type
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm"
                                onClick={() =>
                                  handleQueryTypeSelection(feature.type)
                                }
                              >
                                <feature.icon className="h-3 w-3 sm:h-4 sm:h-4" />
                                {t(feature.label)} {/* Translate feature label */}
                              </Button>
                            ))}
                          </div>
                        </div>
  
                        <div className="px-3 sm:px-4">
                          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:h-9"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Paperclip className="h-4 w-4 sm:h-5 sm:h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 sm:h-9 sm:h-9 ${
                                isRecording ? "text-red-500" : ""
                              }`}
                              onClick={toggleRecording}
                            >
                              <Mic className="h-4 w-4 sm:h-5 sm:h-5" />
                            </Button>
                            <Input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleSend()
                              }
                              placeholder={t('type_your_message')} // Translate placeholder
                              className="flex-1 text-sm"
                            />
                            <Button
                              onClick={handleSend}
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:h-9"
                            >
                              <Send className="h-4 w-4 sm:h-5 sm:h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
  
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent opacity-50" />
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}