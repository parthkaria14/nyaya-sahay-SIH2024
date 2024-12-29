import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  previousValue: string;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  previousValue,
}: StatsCardProps) {
  const isPositive = trend.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {title}
                  </p>
                  <h3 className="text-2xl font-bold mt-2 text-blue-800">{value}</h3>
                </div>
                <div
                  className={`flex items-center ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {trend}
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                {description}
              </p>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-700 text-white">
            <p>Previous value: {previousValue}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}