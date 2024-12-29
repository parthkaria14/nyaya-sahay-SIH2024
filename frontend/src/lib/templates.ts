import { Category, Template } from '@/types/templates';

// Static template categories
export const templateCategories: Category[] = [
  { id: 'affidavits', name: 'Affidavits' },
  { id: 'legal-notices', name: 'Legal Notices' },
  { id: 'court-documents', name: 'Court Documents' },
  { id: 'agreements', name: 'Legal Agreements' },
];

// Static template definitions
export const templateDefinitions: Template[] = [
  {
    id: 'general-affidavit',
    categoryId: 'affidavits',
    name: 'General Affidavit',
    description: 'Standard affidavit format for general purposes',
    fileName: 'general-affidavit.pdf',
    fileUrl: '/static/templates/affidavits/general-affidavit.pdf',
    previewUrl: '/static/templates/affidavits/general-affidavit-preview.pdf',
    downloads: 1234,
  },
  {
    id: 'self-declaration',
    categoryId: 'affidavits',
    name: 'Self Declaration',
    description: 'Self declaration affidavit template',
    fileName: 'self-declaration.pdf',
    fileUrl: '/static/templates/affidavits/self-declaration.pdf',
    previewUrl: '/static/templates/affidavits/self-declaration-preview.pdf',
    downloads: 856,
  },
  {
    id: 'legal-notice',
    categoryId: 'legal-notices',
    name: 'Legal Notice Template',
    description: 'Standard format for legal notices',
    fileName: 'legal-notice.pdf',
    fileUrl: '/static/templates/legal-notices/legal-notice.pdf',
    previewUrl: '/static/templates/legal-notices/legal-notice-preview.pdf',
    downloads: 2341,
  },
  // Add more templates as needed
];

// Helper function to get templates by category
export function getTemplatesByCategory(categoryId: string): Template[] {
  return templateDefinitions.filter(template => template.categoryId === categoryId);
}

// Helper function to get a template by ID
export function getTemplateById(templateId: string): Template | undefined {
  return templateDefinitions.find(template => template.id === templateId);
}