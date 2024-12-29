import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { StatsCard } from '../shared/StatsCard';
import { caseStats } from '@/lib/sample-data';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Cases"
            {...caseStats.activeCases}
          />
          <StatsCard
            title="Cases Tracked"
            {...caseStats.trackedCases}
          />
          <StatsCard
            title="User Satisfaction"
            {...caseStats.satisfaction}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            {/* Add recent activities list */}
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {/* Add upcoming events list */}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}