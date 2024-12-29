import {
  BarChart3,
  BookOpen,
  FileText,
  Gavel,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link, useLocation } from 'react-router-dom';
import { TranslatedText } from '../shared/TranslatedText';

const items = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Overview of your activities and cases',
  },
  {
    title: 'DoJ Information',
    icon: Gavel,
    href: '/information',
    description: 'Access Department of Justice resources',
  },
  {
    title: 'Case Status',
    icon: BarChart3,
    href: '/case-status',
    description: 'Track your case progress',
  },
  {
    title: 'Digital Services',
    icon: FileText,
    href: '/services',
    description: 'Access e-filing and other digital services',
  },
  {
    title: 'Court Streaming',
    icon: MessageSquare,
    href: '/streaming',
    description: 'Watch live court proceedings',
  },
  {
    title: 'Tele Law',
    icon: Phone,
    href: '/tele-law',
    description: 'Connect with legal experts remotely',
  },
  {
    title: 'Legal Aid',
    icon: HelpCircle,
    href: '/legal-aid',
    description: 'Find free legal assistance',
  },
  {
    title: 'Document Templates',
    icon: BookOpen,
    href: '/templates',
    description: 'Access legal document templates',
  },
  {
    title: 'Profile',
    icon: UserCircle,
    href: '/profile',
    description: 'Manage your account settings',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Configure application preferences',
  },
];

export function NavItems() {
  const location = useLocation();

  return (
    <div className="grid gap-4 p-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <TranslatedText text={item.title} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <TranslatedText text={item.description} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}