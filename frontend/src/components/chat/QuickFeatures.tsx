import { Button } from '@/components/ui/button';
import { TranslatedText } from '../shared/TranslatedText';
import { Scale, Video, Phone, FileText, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const features = [
  { icon: Scale, label: 'case_status', path: '/case-status' }, // Use translation key
  { icon: Video, label: 'court_streaming', path: '/streaming' }, // Use translation key
  { icon: Phone, label: 'tele_law', path: '/tele-law' }, // Use translation key
  { icon: FileText, label: 'templates', path: '/templates' }, // Use translation key
  { icon: HelpCircle, label: 'legal_aid', path: '/legal-aid' }, // Use translation key
];

interface QuickFeaturesProps {
  onNavigate: (path: string) => void;
}

export function QuickFeatures({ onNavigate }: QuickFeaturesProps) {
  return (
    <div className="p-4 border-b bg-white">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {features.map((feature, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap bg-blue-700 text-white hover:bg-blue-800 border-none"
                  onClick={() => onNavigate(feature.path)}
                >
                  <feature.icon className="h-4 w-4" />
                  <TranslatedText text={feature.label} /> {/* Translate label */}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#FBAC1B] text-white">
                <TranslatedText text={`navigate_to_${feature.label}`} /> {/* Translate tooltip */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}