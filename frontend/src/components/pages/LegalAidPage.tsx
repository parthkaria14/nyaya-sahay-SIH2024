import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Scale, Users, FileCheck, HelpCircle } from 'lucide-react';

const eligibilityCriteria = [
  {
    title: 'Income Threshold',
    content: 'Annual income below the specified limit as per legal aid regulations.',
  },
  {
    title: 'Case Merit',
    content: 'Your case must have reasonable grounds for legal proceedings.',
  },
  {
    title: 'Citizenship',
    content: 'Valid citizenship or residency status required.',
  },
  {
    title: 'Case Type',
    content: 'Civil, criminal, or family law cases eligible for legal aid.',
  },
];

const services = [
  {
    icon: Scale,
    title: 'Legal Representation',
    description: 'Free legal representation in courts',
  },
  {
    icon: Users,
    title: 'Legal Consultation',
    description: 'Expert advice from qualified lawyers',
  },
  {
    icon: FileCheck,
    title: 'Document Assistance',
    description: 'Help with legal documentation',
  },
  {
    icon: HelpCircle,
    title: 'General Guidance',
    description: 'Information about legal processes',
  },
];

export default function LegalAidPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Legal Aid Support</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-4 h-full hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
              <Accordion type="single" collapsible className="w-full">
                {eligibilityCriteria.map((criteria, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{criteria.title}</AccordionTrigger>
                    <AccordionContent>{criteria.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Button className="w-full">Check Eligibility</Button>
                <Button variant="outline" className="w-full">
                  Find Legal Aid Center
                </Button>
                <Button variant="outline" className="w-full">
                  Download Forms
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our support team for assistance with legal aid applications
                and queries.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}