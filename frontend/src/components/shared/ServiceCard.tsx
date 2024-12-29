import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
}

export function ServiceCard({
  title,
  description,
  Icon,
  href,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 bg-white border border-[#FBAC1B]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Icon className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
          </div>
          <p className="text-blue-600 mb-6">{description}</p>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 group bg-blue-700 text-white hover:bg-blue-800 border-none"
          asChild
        >
          <a href={href}>
            Explore
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </Card>
    </motion.div>
  );
}