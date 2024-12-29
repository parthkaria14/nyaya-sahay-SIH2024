import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function CaseStatusPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Case Status</h1>

        <Card className="p-6">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Track Your Case</h2>
              <p className="text-sm text-muted-foreground">
                Enter your case number to check its current status
              </p>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Enter Case Number" />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Cases</h2>
            {/* Add recent cases list */}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Case Statistics</h2>
            {/* Add case statistics */}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}