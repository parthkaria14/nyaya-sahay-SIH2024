import { useState, useCallback } from 'react';
import { Template } from '@/types/templates';
import { templateDefinitions } from '@/lib/templates/definitions';
import { getTemplatesByCategory } from '@/lib/templates/utils';
import { toast } from 'sonner';

export function useTemplates() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadTemplate = useCallback(async (template: Template) => {
    try {
      setIsLoading(true);
      const response = await fetch(template.fileUrl);
      if (!response.ok) throw new Error('Failed to fetch template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const previewTemplate = useCallback((template: Template) => {
    try {
      window.open(template.previewUrl, '_blank');
    } catch (error) {
      toast.error('Failed to open preview');
      console.error('Preview error:', error);
    }
  }, []);

  return {
    templates: templateDefinitions,
    getTemplatesByCategory,
    downloadTemplate,
    previewTemplate,
    isLoading,
  };
}