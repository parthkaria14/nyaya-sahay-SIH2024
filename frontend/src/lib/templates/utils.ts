import { Template } from '@/types/templates';
import { templateDefinitions } from './definitions';

export function getTemplatesByCategory(categoryId: string): Template[] {
  return templateDefinitions.filter(template => template.categoryId === categoryId);
}

export function getTemplateById(templateId: string): Template | undefined {
  return templateDefinitions.find(template => template.id === templateId);
}

export function searchTemplates(query: string): Template[] {
  const searchTerm = query.toLowerCase().trim();
  
  return templateDefinitions.filter(template => {
    return (
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
}