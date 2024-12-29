import { Template } from '@/types/templates';

export const templateDefinitions: Template[] = [
  {
    id: 'general-affidavit',
    categoryId: 'affidavits',
    name: 'General Affidavit',
    description: 'Standard affidavit format for general purposes',
    fileName: 'general-affidavit.pdf',
    fileUrl: '/src/components/templates/affidavits/general-affidavit.pdf',
    previewUrl: '/src/components/templates/affidavits/general-affidavit-preview.pdf',
    downloads: 1234,
    tags: ['general', 'standard', 'basic'],
  },
  {
    id: 'self-declaration',
    categoryId: 'affidavits',
    name: 'Self Declaration',
    description: 'Self declaration affidavit template with RTF format for easy editing',
    fileName: 'self-declaration.rtf',
    fileUrl: '/src/components/templates/affidavits/self-declaration.rtf',
    previewUrl: '/src/components/templates/affidavits/self-declaration-preview.pdf',
    downloads: 856,
    tags: ['self', 'declaration', 'personal'],
  },
  {
    id: 'income-affidavit',
    categoryId: 'affidavits',
    name: 'Income Affidavit',
    description: 'Income declaration affidavit template',
    fileName: 'income-affidavit.pdf',
    fileUrl: '/src/components/templates/affidavits/income-affidavit.pdf',
    previewUrl: '/src/components/templates/affidavits/income-affidavit-preview.pdf',
    downloads: 2341,
    tags: ['income', 'financial', 'declaration'],
  },
];