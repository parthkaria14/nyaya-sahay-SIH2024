import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Users, Scale, Landmark } from 'lucide-react';

export default function InformationPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">DoJ Information Hub</h1>

        <Tabs defaultValue="divisions" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="divisions" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Divisions
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="courts" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Fast Track Courts
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Latest Updates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="divisions">
            <Card className="p-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Add division content */}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="p-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Add appointments content */}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="courts">
            <Card className="p-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Add courts content */}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            <Card className="p-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Add updates content */}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}