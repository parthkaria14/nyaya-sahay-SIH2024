// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Search, ChevronRight } from 'lucide-react';
// import { TemplateCategory } from '../templates/TemplateCategory';
// import { useTemplates } from '@/hooks/useTemplates';
// import { templateCategories } from '@/lib/templates/categories';
// import { searchTemplates } from '@/lib/templates/utils';

// export default function TemplatesPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const { downloadTemplate, previewTemplate, getTemplatesByCategory } = useTemplates();

//   const handleSearch = (value: string) => {
//     setSearchQuery(value);
//     if (value) {
//       setSelectedCategory(null);
//     }
//   };

//   const filteredTemplates = searchQuery 
//     ? searchTemplates(searchQuery)
//     : selectedCategory 
//     ? getTemplatesByCategory(selectedCategory)
//     : [];

//   return (
//     <div className="container mx-auto p-4 space-y-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Legal Document Templates</h1>
//         </div>

//         <Card className="p-6 mb-6">
//           <div className="flex gap-4">
//             <div className="relative flex-1 max-w-sm">
//               <Input
//                 placeholder="Search templates..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="pr-10"
//                 type="search"
//               />
//               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             </div>
//           </div>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Categories Sidebar */}
//           <Card className="p-4 md:block">
//             <h2 className="text-lg font-semibold mb-4">Categories</h2>
//             <ScrollArea className="h-[600px]">
//               <div className="space-y-2">
//                 {templateCategories.map((category) => (
//                   <Button
//                     key={category.id}
//                     variant={selectedCategory === category.id ? "secondary" : "ghost"}
//                     className="w-full justify-between"
//                     onClick={() => {
//                       setSelectedCategory(category.id);
//                       setSearchQuery('');
//                     }}
//                   >
//                     <span>{category.name}</span>
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 ))}
//               </div>
//             </ScrollArea>
//           </Card>

//           {/* Templates Grid */}
//           <div className="md:col-span-3">
//             <ScrollArea className="h-[600px]">
//               {selectedCategory && (
//                 <TemplateCategory
//                   category={templateCategories.find(c => c.id === selectedCategory)!}
//                   templates={filteredTemplates}
//                   onDownload={downloadTemplate}
//                   onPreview={previewTemplate}
//                 />
//               )}
//               {searchQuery && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold">Search Results</h2>
//                   <TemplateCategory
//                     category={{ id: 'search', name: 'Search Results' }}
//                     templates={filteredTemplates}
//                     onDownload={downloadTemplate}
//                     onPreview={previewTemplate}
//                   />
//                 </div>
//               )}
//               {!selectedCategory && !searchQuery && (
//                 <Card className="p-6 text-center text-muted-foreground">
//                   Select a category or search for templates
//                 </Card>
//               )}
//             </ScrollArea>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronRight } from 'lucide-react';
import { TemplateCategory } from '../templates/TemplateCategory';
import { useTemplates } from '@/hooks/useTemplates';
import { templateCategories } from '@/lib/templates/categories';
import { searchTemplates } from '@/lib/templates/utils';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { downloadTemplate, previewTemplate, getTemplatesByCategory } = useTemplates();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setSelectedCategory(null);
    }
  };

  const filteredTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory 
    ? getTemplatesByCategory(selectedCategory)
    : [];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Legal Document Templates</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
                type="search"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <Card className="p-4 w-full md:w-auto">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ScrollArea className="h-[400px] md:h-[600px]">
              <div className="space-y-3">
                {templateCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    className="w-full justify-between text-left px-6 py-3"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSearchQuery('');
                    }}
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Templates Grid */}
          <div className="md:col-span-3 w-full">
            <ScrollArea className="h-[400px] md:h-[600px]">
              {selectedCategory && (
                <TemplateCategory
                  category={templateCategories.find(c => c.id === selectedCategory)!}
                  templates={filteredTemplates}
                  onDownload={downloadTemplate}
                  onPreview={previewTemplate}
                />
              )}
              {searchQuery && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Search Results</h2>
                  <TemplateCategory
                    category={{ id: 'search', name: 'Search Results' }}
                    templates={filteredTemplates}
                    onDownload={downloadTemplate}
                    onPreview={previewTemplate}
                  />
                </div>
              )}
              {!selectedCategory && !searchQuery && (
                <Card className="p-6 text-center text-muted-foreground">
                  Select a category or search for templates
                </Card>
              )}
            </ScrollArea>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
