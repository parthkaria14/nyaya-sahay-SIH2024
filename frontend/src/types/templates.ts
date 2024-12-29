export interface Category {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  fileName: string;
  fileUrl: string;
  previewUrl: string;
  downloads: number;
  tags: string[];
}