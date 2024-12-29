import { Scale, Video, Phone, FileText, HelpCircle } from 'lucide-react';

export const caseStats = {
  activeCases: {
    value: '234,567',
    trend: '+12.3%',
    description: 'Currently being processed',
    previousValue: '208,874',
  },
  trackedCases: {
    value: '45,678',
    trend: '+5.7%',
    description: 'Through our platform',
    previousValue: '43,214',
  },
  satisfaction: {
    value: '98%',
    trend: '+2.4%',
    description: 'Based on feedback',
    previousValue: '95.6%',
  },
};

export const quickFeatures = [
  {
    icon: Scale,
    label: 'Case Status',
    path: '/case-status',
    description: 'Track your case progress',
  },
  {
    icon: Video,
    label: 'Court Streaming',
    path: '/streaming',
    description: 'Watch live proceedings',
  },
  {
    icon: Phone,
    label: 'Tele Law',
    path: '/tele-law',
    description: 'Connect with experts',
  },
  {
    icon: FileText,
    label: 'Templates',
    path: '/templates',
    description: 'Access document templates',
  },
  {
    icon: HelpCircle,
    label: 'Legal Aid',
    path: '/legal-aid',
    description: 'Get free legal assistance',
  },
];