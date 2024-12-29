import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FileText, CreditCard, AlertTriangle } from 'lucide-react';

const services = [
  {
    title: 'eFiling',
    description: 'File cases and documents electronically',
    icon: FileText,
  },
  {
    title: 'ePay',
    description: 'Make court fee payments online',
    icon: CreditCard,
  },
  {
    title: 'Traffic Violations',
    description: 'Pay traffic violation fines',
    icon: AlertTriangle,
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Digital Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{service.title}</h2>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}