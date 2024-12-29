import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ChatButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        delay: 0.5,
      }}
    >
      <Button
        size="lg"
        className="rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-blue-700 text-white hover:bg-blue-800"
        onClick={() => navigate('/chat')}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}