import { motion } from 'framer-motion';
import { HeroSection } from '@/components/ui/hero-section';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Scale, Video, Phone, FileText, HelpCircle, FileCheck } from 'lucide-react';

const services = [
  {
    title: 'Case Status',
    description: 'Track and monitor your case progress in real-time',
    icon: Scale,
    href: '/case-status',
  },
  {
    title: 'Court Streaming',
    description: 'Watch live court proceedings and archived sessions',
    icon: Video,
    href: '/streaming',
  },
  {
    title: 'Tele Law',
    description: 'Connect with legal experts for consultations',
    icon: Phone,
    href: '/tele-law',
  },
  {
    title: 'Legal Documents',
    description: 'Access and download legal documents',
    icon: FileText,
    href: '/templates',
  },
  {
    title: 'Legal Aid',
    description: 'Get free legal assistance and support',
    icon: HelpCircle,
    href: '/legal-aid',
  },
  {
    title: 'Digital Services',
    description: 'Access e-filing and other digital services',
    icon: FileCheck,
    href: '/services',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <div className="container mx-auto px-4 py-24">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              Our Services
            </h2>
            <p className="text-blue-600 max-w-2xl mx-auto">
              Comprehensive legal services and resources at your fingertips
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <ServiceCard 
                  {...service} 
                  Icon={service.icon}
                  className="bg-white hover:bg-blue-50 border-blue-100"
                  iconClassName="text-blue-700"
                  titleClassName="text-blue-800"
                  descriptionClassName="text-blue-600"
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}