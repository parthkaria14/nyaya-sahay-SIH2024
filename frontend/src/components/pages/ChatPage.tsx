import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

// Define the SpeechRecognition type
type SpeechRecognition =
  | typeof window.webkitSpeechRecognition
  | typeof window.SpeechRecognition;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I assist you with legal services today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null); // Ref for SpeechRecognition
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState<string | null>(null); // Tracks errors for the user.

  // Initialize SpeechRecognition
  useEffect(() => {
    const isSpeechRecognitionSupported =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    setIsSpeechSupported(isSpeechRecognitionSupported);

    if (isSpeechRecognitionSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      // Set up event handlers for recognition
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognition.current.onerror = (event) => {
        setIsRecording(false);

        switch (event.error) {
          case "network":
            setError("Network error. Please check your connection.");
            break;
          case "not-allowed":
            setError(
              "Microphone access denied. Please enable microphone permissions."
            );
            break;
          case "no-speech":
            setError("No speech detected. Please try again.");
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      // Cleanup recognition on unmount
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: "I understand your query. Let me help you with that...",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const userMessage: Message = {
        id: messages.length + 1,
        content: "Sent an attachment",
        sender: "user",
        timestamp: new Date(),
        attachment: {
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
        },
      };
      setMessages((prev) => [...prev, userMessage]);
    }
  };

  const toggleRecording = async () => {
    if (!isSpeechSupported) {
      setError("Speech recognition is not supported in your browser");
      return;
    }

    if (!recognition.current) {
      setError("Speech recognition not initialized");
      return;
    }

    if (isRecording) {
      recognition.current.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        recognition.current.start();
        setIsRecording(true);
      } catch (error) {
        setError(
          "Microphone access denied. Please enable microphone permissions."
        );
      }
    }
  };

  const dismissError = () => {
    setError(null); // Dismiss error when "X" is clicked.
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <Card className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.attachment ? (
                        <div className="space-y-2">
                          <p>📎 {message.attachment.name}</p>
                          {message.attachment.type.startsWith("image/") && (
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
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            {/* Error Message */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                  onClick={dismissError}
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Input Area */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
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
                      <p>Attach a file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRecording}
                        className={isRecording ? "text-red-500" : ""}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isRecording ? "Stop recording" : "Start recording"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
