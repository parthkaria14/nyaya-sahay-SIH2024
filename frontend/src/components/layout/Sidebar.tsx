import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavItems } from './NavItems';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 border-r bg-background lg:block',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <ScrollArea className="h-full py-6">
          <NavItems />
        </ScrollArea>
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 pt-14">
          <SheetHeader className="px-4">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-7rem)]">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                className="px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <NavItems />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}