import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Clock, ArrowRight } from 'lucide-react';

interface ChatHistory {
  id: number;
  date: string;
  time: string;
  topic: string;
  summary: string;
}

const chatHistory: ChatHistory[] = [
  {
    id: 1,
    date: '2024-03-20',
    time: '14:30',
    topic: 'Case Status Inquiry',
    summary: 'Discussed the current status of case #12345 and next steps',
  },
  {
    id: 2,
    date: '2024-03-19',
    time: '11:15',
    topic: 'Document Submission',
    summary: 'Guidance on required documents for case filing',
  },
  {
    id: 3,
    date: '2024-03-18',
    time: '09:45',
    topic: 'Legal Aid Eligibility',
    summary: 'Checked eligibility criteria for free legal assistance',
  },
];

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Chat History</h1>
        
        <Card className="p-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {chatHistory.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{chat.topic}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {chat.summary}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {chat.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {chat.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  );
}