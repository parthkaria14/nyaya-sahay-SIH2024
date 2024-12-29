import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Calendar, Clock, Users } from 'lucide-react';

interface StreamingSession {
  id: string;
  title: string;
  court: string;
  date: string;
  time: string;
  participants: string;
  status: 'upcoming' | 'live' | 'completed';
}

const streamingSessions: StreamingSession[] = [
  {
    id: '1',
    title: 'Civil Case Hearing #2024-001',
    court: 'Supreme Court - Court Room 1',
    date: '2024-03-21',
    time: '10:00 AM',
    participants: 'Judge Smith, Counsels',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Criminal Case Proceedings #2024-002',
    court: 'High Court - Court Room 3',
    date: '2024-03-21',
    time: '02:30 PM',
    participants: 'Judge Johnson, Public Prosecutor',
    status: 'live',
  },
];

export default function StreamingPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Court Case Streaming</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Live Streaming</h2>
              <p className="text-muted-foreground">
                Select a session from the list to start watching
              </p>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {streamingSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{session.title}</h3>
                          <Button
                            variant={session.status === 'live' ? 'default' : 'outline'}
                            size="sm"
                          >
                            {session.status === 'live' ? 'Join Now' : 'Remind Me'}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.court}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {session.participants}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}